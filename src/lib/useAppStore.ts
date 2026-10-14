import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";
import { toast } from "sonner";
import { t, type Lang } from "./i18n";

export interface BookInfo {
  id?: string;
  title: string;
  subtitle?: string;
  authors: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  pageCount?: number;
  printType?: string;
  categories?: string[];
  imageLinks?: { thumbnail?: string; smallThumbnail?: string };
  isbn?: string;
  isbn13?: string;
  isbn10?: string;
  language?: string;
  link?: string;
}

export interface BookCardData {
  charName: string;
  charLikes: string;
  charDislikes: string;
  charLook: string;
  charPhrase: string;
  charColor: string;
  charEmoji: string;
  drawingDataUrl: string | null;
  uploadedImageUrl: string | null;
  /** 카드에 표시할 캐릭터 그림 출처 */
  imageSource: "upload" | "draw";
  showBookCover: boolean;
}

export interface QuestionItem {
  id: string;
  question: string;
  answer: string;
}

const initialBookCard: BookCardData = {
  charName: "",
  charLikes: "",
  charDislikes: "",
  charLook: "",
  charPhrase: "",
  charColor: "#A8D8EA",
  charEmoji: "",
  drawingDataUrl: null,
  uploadedImageUrl: null,
  imageSource: "upload",
  showBookCover: false,
};

export type ThemeId = "blue" | "green" | "yellow" | "pink";

const newQuestion = (question = ""): QuestionItem => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  question,
  answer: "",
});

/** 카드 내용 초기 상태 (책 선택 포함) */
const initialContent = () => ({
  selectedBook: null,
  customTitle: "",
  bookCard: { ...initialBookCard },
  introText: "",
  introImageUrl: null,
  introRating: 0,
  showIntroBookCover: false,
  showQuestionBookCover: false,
  questions: [{ id: "1", question: "", answer: "" }],
});

/** localStorage 용량 초과 시 앱이 멈추지 않도록 감싸고 한 번만 안내 */
let lastQuotaWarning = 0;
const safeLocalStorage: StateStorage = {
  getItem: (name) => {
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value);
    } catch {
      if (Date.now() - lastQuotaWarning > 15000) {
        lastQuotaWarning = Date.now();
        toast.error(t("storageFull", useAppStore.getState().lang));
      }
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch {
      /* noop */
    }
  },
};

interface AppState {
  lang: Lang;
  theme: ThemeId;
  selectedBook: BookInfo | null;
  customTitle: string;
  bookCard: BookCardData;
  introText: string;
  introImageUrl: string | null;
  introRating: number;
  questions: QuestionItem[];
  setLang: (l: Lang) => void;
  setTheme: (t: ThemeId) => void;
  setSelectedBook: (b: BookInfo | null) => void;
  setCustomTitle: (title: string) => void;
  setBookCard: (data: Partial<BookCardData>) => void;
  setIntroText: (t: string) => void;
  setIntroImageUrl: (url: string | null) => void;
  setIntroRating: (n: number) => void;
  showIntroBookCover: boolean;
  showQuestionBookCover: boolean;
  setShowIntroBookCover: (v: boolean) => void;
  setShowQuestionBookCover: (v: boolean) => void;
  setQuestions: (q: QuestionItem[]) => void;
  addQuestion: (question?: string) => void;
  removeQuestion: (id: string) => void;
  clearContent: () => void;
  reset: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      lang: "ko",
      theme: "blue",
      ...initialContent(),
      setLang: (lang) => {
        document.documentElement.setAttribute("lang", lang);
        set({ lang });
      },
      setTheme: (theme) => {
        document.documentElement.setAttribute("data-theme", theme);
        set({ theme });
      },
      setSelectedBook: (selectedBook) => set({ selectedBook }),
      setCustomTitle: (customTitle) => set({ customTitle }),
      setShowIntroBookCover: (showIntroBookCover) => set({ showIntroBookCover }),
      setShowQuestionBookCover: (showQuestionBookCover) => set({ showQuestionBookCover }),
      setBookCard: (data) =>
        set((s) => ({ bookCard: { ...s.bookCard, ...data } })),
      setIntroText: (introText) => set({ introText }),
      setIntroImageUrl: (introImageUrl) => set({ introImageUrl }),
      setIntroRating: (introRating) => set({ introRating }),
      setQuestions: (questions) => set({ questions }),
      addQuestion: (question) =>
        set((s) => ({ questions: [...s.questions, newQuestion(question)] })),
      removeQuestion: (id) =>
        set((s) => {
          const rest = s.questions.filter((q) => q.id !== id);
          return { questions: rest.length ? rest : [newQuestion()] };
        }),
      clearContent: () => set(initialContent()),
      reset: () => {
        document.documentElement.setAttribute("data-theme", "blue");
        set({ ...initialContent(), theme: "blue" });
      },
    }),
    {
      name: "this-is-book-storage",
      storage: createJSONStorage(() => safeLocalStorage),
      // 이전 버전 저장 데이터에 새 필드가 없어도 기본값으로 채워지도록 bookCard는 깊게 병합
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<AppState>;
        const bookCard = { ...current.bookCard, ...(p.bookCard ?? {}) };
        // 이전 버전: 그림 출처 필드가 없으면 그린 그림만 있는 경우 'draw'로
        if (!p.bookCard?.imageSource) {
          bookCard.imageSource = !bookCard.uploadedImageUrl && bookCard.drawingDataUrl ? "draw" : "upload";
        }
        return { ...current, ...p, bookCard };
      },
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          document.documentElement.setAttribute("data-theme", state.theme);
        }
        if (state?.lang) {
          document.documentElement.setAttribute("lang", state.lang);
        }
      },
      partialize: (state) => ({
        lang: state.lang,
        theme: state.theme,
        selectedBook: state.selectedBook,
        customTitle: state.customTitle,
        bookCard: state.bookCard,
        introText: state.introText,
        introImageUrl: state.introImageUrl,
        introRating: state.introRating,
        showIntroBookCover: state.showIntroBookCover,
        showQuestionBookCover: state.showQuestionBookCover,
        questions: state.questions,
      }),
    }
  )
);
