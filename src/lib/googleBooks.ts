import type { BookInfo } from "./useAppStore";

const API_KEY = "AIzaSyCjfvK2Afrv8Dzmw6Z0RrJHNld6BqYdcoQ";

function mapVolumeToBookInfo(item: any): BookInfo {
  const v = item.volumeInfo || {};
  const industryIds = v.industryIdentifiers || [];
  const isbn13 = industryIds.find((i: any) => i.type === "ISBN_13");
  const isbn10 = industryIds.find((i: any) => i.type === "ISBN_10");

  return {
    id: item.id,
    title: v.title || "",
    subtitle: v.subtitle,
    authors: v.authors || [],
    publisher: v.publisher,
    publishedDate: v.publishedDate,
    description: v.description,
    pageCount: v.pageCount,
    printType: v.printType,
    categories: v.categories,
    imageLinks: v.imageLinks,
    isbn: isbn13?.identifier || isbn10?.identifier,
    isbn13: isbn13?.identifier,
    isbn10: isbn10?.identifier,
    language: v.language,
  } as BookInfo;
}

export async function searchBooksByIsbn(isbn: string): Promise<BookInfo[]> {
  // Clean the ISBN (remove hyphens/spaces)
  const cleaned = isbn.replace(/[-\s]/g, "");
  return searchBooks(`isbn:${cleaned}`);
}

export async function searchBooks(query: string): Promise<BookInfo[]> {
  if (!query.trim()) return [];
  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10&langRestrict=ko&key=${API_KEY}`
  );
  if (!res.ok) return [];
  const data = await res.json();
  if (!data.items) return [];

  return data.items.map(mapVolumeToBookInfo);
}

export async function fetchBookById(id: string): Promise<BookInfo | null> {
  if (!id) return null;
  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(id)}?key=${API_KEY}`
  );
  if (!res.ok) return null;
  const data = await res.json();
  return mapVolumeToBookInfo(data);
}
