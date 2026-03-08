import { create } from "zustand";
import type { Lang } from "./i18n";

export interface BookInfo {
  title: string;
  authors: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  pageCount?: number;
  categories?: string[];
  imageLinks?: { thumbnail?: string; smallThumbnail?: string };
  isbn?: string;
  language?: string;
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

interface AppState {
  lang: Lang;
  theme: "blue" | "green" | "yellow" | "pink";
  selectedBook: BookInfo | null;
  bookCard: BookCardData;
  introText: string;
  questions: QuestionItem[];
  setLang: (l: Lang) => void;
  setTheme: (t: "blue" | "green" | "yellow" | "pink") => void;
  setSelectedBook: (b: BookInfo | null) => void;
  setBookCard: (data: Partial<BookCardData>) => void;
  setIntroText: (t: string) => void;
  setQuestions: (q: QuestionItem[]) => void;
  addQuestion: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  lang: "ko",
  theme: "blue",
  selectedBook: null,
  bookCard: {
    charName: "",
    charLikes: "",
    charDislikes: "",
    charLook: "",
    charPhrase: "",
    charColor: "#A8D8EA",
    charEmoji: "📚",
    drawingDataUrl: null,
    uploadedImageUrl: null,
  },
  introText: "",
  questions: [{ id: "1", question: "", answer: "" }],
  setLang: (lang) => set({ lang }),
  setTheme: (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    set({ theme });
  },
  setSelectedBook: (selectedBook) => set({ selectedBook }),
  setBookCard: (data) =>
    set((s) => ({ bookCard: { ...s.bookCard, ...data } })),
  setIntroText: (introText) => set({ introText }),
  setQuestions: (questions) => set({ questions }),
  addQuestion: () =>
    set((s) => ({
      questions: [
        ...s.questions,
        { id: Date.now().toString(), question: "", answer: "" },
      ],
    })),
}));
