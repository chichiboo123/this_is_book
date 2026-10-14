import type { BookInfo } from "./useAppStore";

/**
 * 책 검색 — 네이버 책 검색 API 종료(2026-07-31)로 교체.
 *  1순위: 카카오(다음) 책 검색 — 서버리스 함수가 API 키를 붙여 중계 (한국 도서에 강함)
 *  2순위: Google Books — 키 없이 브라우저에서 바로 호출 (카카오 키 미설정·오류 시 자동 대체)
 */
export type BookProvider = "kakao" | "google";

export interface BookSearchResult {
  provider: BookProvider;
  books: BookInfo[];
}

export const PROVIDER_LABEL: Record<BookProvider, string> = {
  kakao: "Kakao 책 검색",
  google: "Google Books",
};

// ── 카카오 ─────────────────────────────────────────────────────
interface KakaoBookDoc {
  title?: string;
  contents?: string;
  url?: string;
  isbn?: string;
  datetime?: string;
  authors?: string[];
  publisher?: string;
  translators?: string[];
  thumbnail?: string;
}

const KAKAO_URL = import.meta.env.PROD ? "/.netlify/functions/kakao-book-search" : "/api/kakao-book-search";

/** 카카오 isbn 필드: "ISBN10 ISBN13" 공백 구분 (한쪽이 비어 있을 수 있음) */
export function parseIsbn(isbnStr: string): { isbn?: string; isbn10?: string; isbn13?: string } {
  const parts = (isbnStr || "").trim().split(/\s+/).filter(Boolean);
  const isbn10 = parts.find((p) => p.length === 10);
  const isbn13 = parts.find((p) => p.length === 13);
  return { isbn: isbn13 || isbn10, isbn10, isbn13 };
}

export function mapKakaoDoc(doc: KakaoBookDoc): BookInfo {
  const { isbn, isbn10, isbn13 } = parseIsbn(doc.isbn ?? "");
  const thumb = doc.thumbnail?.replace(/^http:\/\//, "https://");
  return {
    id: isbn13 || isbn10 || undefined,
    title: (doc.title ?? "").trim(),
    authors: (doc.authors ?? []).filter(Boolean),
    publisher: doc.publisher || undefined,
    publishedDate: doc.datetime ? doc.datetime.slice(0, 10) : undefined,
    description: (doc.contents ?? "").trim() || undefined,
    imageLinks: thumb ? { thumbnail: thumb, smallThumbnail: thumb } : undefined,
    isbn,
    isbn10,
    isbn13,
    link: doc.url || undefined,
  };
}

async function searchKakao(query: string): Promise<BookInfo[]> {
  const res = await fetch(`${KAKAO_URL}?query=${encodeURIComponent(query)}&size=50`);
  if (!res.ok) throw new Error(`kakao ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data?.documents)) throw new Error("kakao invalid response");
  return (data.documents as KakaoBookDoc[]).map(mapKakaoDoc).filter((b) => b.title);
}

// ── Google Books ──────────────────────────────────────────────
interface GoogleVolume {
  id?: string;
  volumeInfo?: {
    title?: string;
    subtitle?: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    categories?: string[];
    language?: string;
    infoLink?: string;
    imageLinks?: { thumbnail?: string; smallThumbnail?: string };
    industryIdentifiers?: { type: string; identifier: string }[];
  };
}

export function mapGoogleVolume(v: GoogleVolume): BookInfo {
  const info = v.volumeInfo ?? {};
  const ids = info.industryIdentifiers ?? [];
  const isbn13 = ids.find((i) => i.type === "ISBN_13")?.identifier;
  const isbn10 = ids.find((i) => i.type === "ISBN_10")?.identifier;
  const https = (u?: string) => u?.replace(/^http:\/\//, "https://");
  const thumb = https(info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail);
  return {
    id: isbn13 || isbn10 || v.id,
    title: (info.title ?? "").trim(),
    subtitle: info.subtitle,
    authors: info.authors ?? [],
    publisher: info.publisher,
    publishedDate: info.publishedDate,
    description: info.description,
    pageCount: info.pageCount,
    categories: info.categories,
    language: info.language,
    imageLinks: thumb ? { thumbnail: thumb, smallThumbnail: thumb } : undefined,
    isbn: isbn13 || isbn10,
    isbn13,
    isbn10,
    link: https(info.infoLink),
  };
}

async function searchGoogle(query: string): Promise<BookInfo[]> {
  const key = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
  const params = new URLSearchParams({ q: query, maxResults: "40", printType: "books" });
  if (key) params.set("key", key);
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes?${params}`);
  if (!res.ok) throw new Error(`google ${res.status}`);
  const data = await res.json();
  return ((data?.items ?? []) as GoogleVolume[]).map(mapGoogleVolume).filter((b) => b.title);
}

// ── 통합 ──────────────────────────────────────────────────────
export async function searchBooks(query: string): Promise<BookSearchResult> {
  const q = query.trim();
  if (!q) return { provider: "kakao", books: [] };
  try {
    return { provider: "kakao", books: await searchKakao(q) };
  } catch (err) {
    console.warn("Kakao book search unavailable, falling back to Google Books:", err);
    return { provider: "google", books: await searchGoogle(q) };
  }
}
