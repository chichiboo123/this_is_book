import type { BookInfo } from "./useAppStore";

export async function searchBooks(query: string): Promise<BookInfo[]> {
  if (!query.trim()) return [];
  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10&langRestrict=ko`
  );
  if (!res.ok) return [];
  const data = await res.json();
  if (!data.items) return [];

  return data.items.map((item: any) => {
    const v = item.volumeInfo;
    const industryIds = v.industryIdentifiers || [];
    const isbn13 = industryIds.find((i: any) => i.type === "ISBN_13");
    const isbn10 = industryIds.find((i: any) => i.type === "ISBN_10");

    return {
      title: v.title || "",
      authors: v.authors || [],
      publisher: v.publisher,
      publishedDate: v.publishedDate,
      description: v.description,
      pageCount: v.pageCount,
      categories: v.categories,
      imageLinks: v.imageLinks,
      isbn: isbn13?.identifier || isbn10?.identifier,
      language: v.language,
    } as BookInfo;
  });
}
