export const BOOK_SEARCH_INPUT_ID = "book-search-input";

/** 다른 화면에서 '책 고르러 가기'를 눌렀을 때 검색창으로 이동 */
export function focusBookSearch() {
  document.getElementById("step-pick")?.scrollIntoView({ behavior: "smooth", block: "start" });
  setTimeout(() => document.getElementById(BOOK_SEARCH_INPUT_ID)?.focus({ preventScroll: true }), 350);
}

export function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}
