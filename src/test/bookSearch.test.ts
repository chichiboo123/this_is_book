import { describe, it, expect, vi, afterEach } from "vitest";
import { mapKakaoDoc, mapGoogleVolume, parseIsbn, searchBooks } from "@/lib/bookSearch";

describe("책 검색 응답 변환", () => {
  it("카카오 문서를 BookInfo로 변환한다", () => {
    const book = mapKakaoDoc({
      title: "어린 왕자",
      contents: "사막에 불시착한 비행사…",
      url: "https://search.daum.net/search?w=bookpage&bookId=1",
      isbn: " 9788954608649",
      datetime: "2007-06-25T00:00:00.000+09:00",
      authors: ["앙투안 드 생텍쥐페리"],
      publisher: "문학동네",
      thumbnail: "http://search1.kakaocdn.net/thumb/x.jpg",
    });
    expect(book).toMatchObject({
      id: "9788954608649",
      title: "어린 왕자",
      authors: ["앙투안 드 생텍쥐페리"],
      publishedDate: "2007-06-25",
      isbn13: "9788954608649",
      imageLinks: { thumbnail: "https://search1.kakaocdn.net/thumb/x.jpg" },
    });
    expect(book.isbn10).toBeUndefined();
  });

  it("Google Books 볼륨을 BookInfo로 변환한다", () => {
    const book = mapGoogleVolume({
      id: "abc",
      volumeInfo: {
        title: "The Little Prince",
        authors: ["Antoine de Saint-Exupéry"],
        publishedDate: "2000",
        pageCount: 96,
        infoLink: "http://books.google.com/books?id=abc",
        imageLinks: { thumbnail: "http://books.google.com/thumb" },
        industryIdentifiers: [
          { type: "ISBN_10", identifier: "0156012197" },
          { type: "ISBN_13", identifier: "9780156012195" },
        ],
      },
    });
    expect(book).toMatchObject({
      id: "9780156012195",
      isbn: "9780156012195",
      isbn10: "0156012197",
      pageCount: 96,
      link: "https://books.google.com/books?id=abc",
      imageLinks: { thumbnail: "https://books.google.com/thumb" },
    });
  });

  it("ISBN 문자열을 나눈다", () => {
    expect(parseIsbn("8954608647 9788954608649")).toEqual({ isbn: "9788954608649", isbn10: "8954608647", isbn13: "9788954608649" });
    expect(parseIsbn("")).toEqual({ isbn: undefined, isbn10: undefined, isbn13: undefined });
  });
});

describe("searchBooks", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("카카오 키가 없으면(503) Google Books로 대체한다", async () => {
    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes("kakao")) return new Response(JSON.stringify({ error: "not_configured" }), { status: 503 });
      return new Response(JSON.stringify({ items: [{ id: "g1", volumeInfo: { title: "어린 왕자" } }] }), { status: 200 });
    });
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const res = await searchBooks("어린 왕자");
    expect(res.provider).toBe("google");
    expect(res.books[0].title).toBe("어린 왕자");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("카카오 결과가 있으면 카카오를 사용한다", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ documents: [{ title: "어린 왕자", authors: [] }] }), { status: 200 }))
    );
    const res = await searchBooks("어린 왕자");
    expect(res.provider).toBe("kakao");
    expect(res.books).toHaveLength(1);
  });
});
