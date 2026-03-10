import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Lang } from "./i18n";

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
};

interface AppState {
  lang: Lang;
  theme: "blue" | "green" | "yellow" | "pink";
  selectedBook: BookInfo | null;
  customTitle: string;
  bookCard: BookCardData;
  introText: string;
  introImageUrl: string | null;
  questions: QuestionItem[];
  setLang: (l: Lang) => void;
  setTheme: (t: "blue" | "green" | "yellow" | "pink") => void;
  setSelectedBook: (b: BookInfo | null) => void;
  setCustomTitle: (title: string) => void;
  setBookCard: (data: Partial<BookCardData>) => void;
  setIntroText: (t: string) => void;
  setIntroImageUrl: (url: string | null) => void;
  setQuestions: (q: QuestionItem[]) => void;
  addQuestion: () => void;
  reset: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      lang: "ko",
      theme: "blue",
      selectedBook: null,
      customTitle: "",
      bookCard: { ...initialBookCard },
      introText: "",
      introImageUrl: null,
      questions: [{ id: "1", question: "", answer: "" }],
      setLang: (lang) => set({ lang }),
      setTheme: (theme) => {
        document.documentElement.setAttribute("data-theme", theme);
        set({ theme });
      },
      setSelectedBook: (selectedBook) => set({ selectedBook }),
      setCustomTitle: (customTitle) => set({ customTitle }),
      setBookCard: (data) =>
        set((s) => ({ bookCard: { ...s.bookCard, ...data } })),
      setIntroText: (introText) => set({ introText }),
      setIntroImageUrl: (introImageUrl) => set({ introImageUrl }),
      setQuestions: (questions) => set({ questions }),
      addQuestion: () =>
        set((s) => ({
          questions: [
            ...s.questions,
            { id: Date.now().toString(), question: "", answer: "" },
          ],
        })),
      reset: () => {
        document.documentElement.setAttribute("data-theme", "blue");
        set({
          selectedBook: null,
          customTitle: "",
          bookCard: { ...initialBookCard },
          introText: "",
          introImageUrl: null,
          questions: [{ id: "1", question: "", answer: "" }],
          theme: "blue",
        });
      },
    }),
    {
      name: "this-is-book-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          document.documentElement.setAttribute("data-theme", state.theme);
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
        questions: state.questions,
      }),
    }
  )
);
