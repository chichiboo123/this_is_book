import type { BookInfo } from "./useAppStore";

/** 네이버 API가 검색어에 감싸는 <b> 등 HTML 태그를 제거 */
function stripHtml(str: string): string {
  return str.replace(/<[^>]+>/g, "").trim();
}

/** 네이버 author 필드는 '^' 또는 '|' 로 구분 */
function parseAuthors(authorStr: string): string[] {
  if (!authorStr) return [];
  return authorStr
    .split(/[|^]/)
    .map((a) => a.trim())
    .filter(Boolean);
}

/** 네이버 isbn 필드: "ISBN10 ISBN13" 공백 구분 */
function parseIsbn(isbnStr: string): { isbn?: string; isbn10?: string; isbn13?: string } {
  if (!isbnStr) return {};
  const parts = isbnStr.trim().split(/\s+/);
  const isbn10 = parts.find((p) => p.length === 10);
  const isbn13 = parts.find((p) => p.length === 13);
  return { isbn: isbn13 || isbn10, isbn10, isbn13 };
}

/** pubdate: "20230101" → "2023-01-01" */
function formatPubDate(pubdate: string): string {
  if (!pubdate || pubdate.length !== 8) return pubdate;
  return `${pubdate.slice(0, 4)}-${pubdate.slice(4, 6)}-${pubdate.slice(6, 8)}`;
}

function mapItemToBookInfo(item: any): BookInfo {
  const { isbn, isbn10, isbn13 } = parseIsbn(item.isbn);
  return {
    id: isbn13 || isbn10 || undefined,
    title: stripHtml(item.title || ""),
    authors: parseAuthors(item.author),
    publisher: item.publisher || undefined,
    publishedDate: item.pubdate ? formatPubDate(item.pubdate) : undefined,
    description: stripHtml(item.description || ""),
    imageLinks: item.image
      ? { thumbnail: item.image, smallThumbnail: item.image }
      : undefined,
    isbn,
    isbn13,
    isbn10,
  };
}

export async function searchBooks(query: string): Promise<BookInfo[]> {
  if (!query.trim()) return [];
  const res = await fetch(
    `/api/naver/v1/search/book.json?query=${encodeURIComponent(query)}&display=10`
  );
  if (!res.ok) return [];
  const data = await res.json();
  if (!data.items) return [];
  return data.items.map(mapItemToBookInfo);
}

export async function searchBooksByIsbn(isbn: string): Promise<BookInfo[]> {
  const cleaned = isbn.replace(/[-\s]/g, "");
  return searchBooks(cleaned);
}
