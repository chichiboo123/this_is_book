import type { BookCardData, QuestionItem } from "./useAppStore";

export type CardKey = "bookCard" | "introCard" | "questionCard";

export const CARD_KEYS: CardKey[] = ["bookCard", "introCard", "questionCard"];

export const CARD_EMOJI: Record<CardKey, string> = {
  bookCard: "🎭",
  introCard: "📣",
  questionCard: "❓",
};

interface ProgressInput {
  bookCard: BookCardData;
  introText: string;
  questions: QuestionItem[];
}

/** 카드별 '완성' 기준 — 핵심 항목이 채워졌는지 */
export function cardStatus(s: ProgressInput): Record<CardKey, boolean> {
  return {
    bookCard: !!s.bookCard.charName.trim(),
    introCard: !!s.introText.trim(),
    questionCard: s.questions.some((q) => q.question.trim()),
  };
}

/** 지울 내용이 있는지 (초기화 확인 여부 판단용) */
export function hasAnyContent(s: ProgressInput & { introImageUrl: string | null }): boolean {
  const b = s.bookCard;
  return !!(
    b.charName || b.charLikes || b.charDislikes || b.charLook || b.charPhrase ||
    b.charEmoji || b.drawingDataUrl || b.uploadedImageUrl ||
    s.introText || s.introImageUrl ||
    s.questions.some((q) => q.question || q.answer)
  );
}
