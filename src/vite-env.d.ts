/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** (선택) Google Books API 키 — 없어도 동작하며, 있으면 호출 한도가 늘어남 */
  readonly VITE_GOOGLE_BOOKS_API_KEY?: string;
}
