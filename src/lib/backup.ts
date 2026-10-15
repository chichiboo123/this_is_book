import { useAppStore } from "./useAppStore";

const BACKUP_KEYS = [
  "lang",
  "theme",
  "selectedBook",
  "customTitle",
  "bookCard",
  "introText",
  "introImageUrl",
  "introRating",
  "showIntroBookCover",
  "showQuestionBookCover",
  "questions",
] as const;

function safeFileName(name: string): string {
  return name.replace(/[\\/:*?"<>|\s]+/g, "_").slice(0, 40) || "this-is-book";
}

/** 현재 작업 전체를 JSON 파일로 내려받기 */
export function downloadBackup() {
  const state = useAppStore.getState();
  const data: Record<string, unknown> = { app: "this-is-book", version: 2, savedAt: new Date().toISOString() };
  for (const k of BACKUP_KEYS) data[k] = state[k];

  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const title = state.customTitle || state.selectedBook?.title || "";
  a.href = url;
  a.download = `책임_${safeFileName(title)}_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** JSON 백업 복원 — 형식이 맞지 않으면 예외 */
function readText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export async function restoreBackup(file: File) {
  const parsed = JSON.parse(await readText(file));
  if (!parsed || typeof parsed !== "object" || (!parsed.bookCard && !parsed.questions && !parsed.selectedBook)) {
    throw new Error("invalid backup");
  }
  // 이전 작업이 섞이지 않도록 내용을 비운 뒤 복원
  const current = useAppStore.getState();
  current.clearContent();
  const blank = useAppStore.getState();

  const next: Record<string, unknown> = {};
  for (const k of BACKUP_KEYS) {
    if (parsed[k] !== undefined && parsed[k] !== null) next[k] = parsed[k];
  }
  if (parsed.selectedBook === null) next.selectedBook = null;
  if (parsed.bookCard) {
    const bookCard = { ...blank.bookCard, ...parsed.bookCard };
    if (!parsed.bookCard.imageSource) {
      bookCard.imageSource = !bookCard.uploadedImageUrl && bookCard.drawingDataUrl ? "draw" : "upload";
    }
    next.bookCard = bookCard;
  }
  if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) delete next.questions;
  // 이전 버전 파일에는 customTitle이 없음 → 책 제목으로 채움
  if (next.customTitle === undefined) next.customTitle = parsed.selectedBook?.title ?? "";

  useAppStore.setState(next);
  if (typeof next.theme === "string") current.setTheme(next.theme as typeof current.theme);
  if (typeof next.lang === "string") current.setLang(next.lang as typeof current.lang);
}
