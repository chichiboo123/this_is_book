import { useState } from "react";
import { useAppStore, type BookInfo } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";
import { searchBooks } from "@/lib/googleBooks";
import { Search } from "lucide-react";

export default function BookSearch() {
  const { lang, setSelectedBook, selectedBook } = useAppStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BookInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    const books = await searchBooks(query);
    setResults(books);
    setLoading(false);
  };

  const handleSelect = (book: BookInfo) => {
    setSelectedBook(book);
    setResults([]);
    setSearched(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="section-title">{t("bookInfo", lang)}</h2>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder={t("searchPlaceholder", lang)}
            className="input-cute w-full pl-9"
          />
        </div>
        <button onClick={handleSearch} className="btn-cute" disabled={loading}>
          {loading ? t("searching", lang) : t("search", lang)}
        </button>
      </div>

      {/* Search Results */}
      {results.length > 0 && (
        <div className="grid gap-3 max-h-80 overflow-y-auto rounded-xl border-2 border-primary/20 p-3 bg-card">
          {results.map((book, i) => (
            <button
              key={i}
              onClick={() => handleSelect(book)}
              className="flex gap-3 items-start text-left p-3 rounded-xl hover:bg-secondary transition-colors"
            >
              {book.imageLinks?.thumbnail && (
                <img
                  src={book.imageLinks.thumbnail}
                  alt={book.title}
                  className="w-12 h-16 rounded-md object-cover flex-shrink-0"
                />
              )}
              <div className="min-w-0">
                <p className="font-bold text-sm text-foreground truncate">{book.title}</p>
                <p className="text-xs text-muted-foreground">{book.authors?.join(", ")}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {searched && !loading && results.length === 0 && (
        <p className="text-center text-muted-foreground py-4">{t("noResults", lang)}</p>
      )}

      {/* Selected Book Info */}
      {selectedBook && <SelectedBookInfo book={selectedBook} />}
    </div>
  );
}

function SelectedBookInfo({ book }: { book: BookInfo }) {
  const { lang } = useAppStore();

  const infoRows: [string, string | undefined][] = [
    [t("title", lang), book.title],
    [t("author", lang), book.authors?.join(", ")],
    [t("publisher", lang), book.publisher],
    [t("publishedDate", lang), book.publishedDate],
    [t("pages", lang), book.pageCount?.toString()],
    [t("categories", lang), book.categories?.join(", ")],
    [t("isbn", lang), book.isbn],
    [t("language", lang), book.language],
  ];

  return (
    <div className="card-activity space-y-4">
      <div className="flex gap-4">
        {book.imageLinks?.thumbnail && (
          <img
            src={book.imageLinks.thumbnail}
            alt={book.title}
            className="w-24 h-32 rounded-xl object-cover shadow-md flex-shrink-0"
          />
        )}
        <div className="space-y-1 min-w-0 flex-1">
          {infoRows.map(
            ([label, value]) =>
              value && (
                <div key={label} className="flex gap-2 text-sm">
                  <span className="font-bold text-primary-foreground/70 flex-shrink-0">{label}:</span>
                  <span className="text-foreground">{value}</span>
                </div>
              )
          )}
        </div>
      </div>
      {book.description && (
        <div>
          <p className="font-bold text-sm text-primary-foreground/70 mb-1">{t("description", lang)}</p>
          <p className="text-sm text-foreground leading-relaxed bg-secondary/50 rounded-xl p-3">
            {book.description}
          </p>
        </div>
      )}
    </div>
  );
}
