import { useState, useRef, useEffect } from "react";
import { useAppStore, type BookInfo } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";
import { searchBooks, searchBooksByIsbn } from "@/lib/googleBooks";
import { Search, Camera, ImageUp, X, ZapIcon } from "lucide-react";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function BookSearch() {
  const { lang, setSelectedBook, selectedBook } = useAppStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BookInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [scanMode, setScanMode] = useState(false);
  const [scanStatus, setScanStatus] = useState<"idle" | "scanning" | "success" | "error">("idle");

  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

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

  // ── Barcode scan ───────────────────────────────────────────────
  const startScan = async () => {
    setScanMode(true);
    setScanStatus("scanning");
  };

  const stopScan = () => {
    readerRef.current?.reset();
    setScanMode(false);
    setScanStatus("idle");
  };

  useEffect(() => {
    if (!scanMode || !videoRef.current) return;

    const codeReader = new BrowserMultiFormatReader();
    readerRef.current = codeReader;

    codeReader.decodeFromVideoDevice(undefined, videoRef.current, async (result, err) => {
      if (result) {
        const isbn = result.getText();
        setScanStatus("success");
        codeReader.reset();
        setScanMode(false);
        setLoading(true);
        setSearched(true);
        const books = await searchBooksByIsbn(isbn);
        if (books.length > 0) {
          setResults(books);
        } else {
          // Fallback: search by the raw text
          const fallback = await searchBooks(isbn);
          setResults(fallback);
        }
        setLoading(false);
        setScanStatus("idle");
      }
    });

    return () => {
      codeReader.reset();
    };
  }, [scanMode]);

  // ── Image file upload → barcode decode ────────────────────────
  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanStatus("scanning");
    setLoading(true);
    setSearched(true);

    try {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.src = url;
      await new Promise((res) => (img.onload = res));

      const codeReader = new BrowserMultiFormatReader();
      try {
        const result = await codeReader.decodeFromImageElement(img);
        const isbn = result.getText();
        URL.revokeObjectURL(url);
        const books = await searchBooksByIsbn(isbn);
        if (books.length > 0) {
          setResults(books);
          setScanStatus("success");
        } else {
          const fallback = await searchBooks(isbn);
          setResults(fallback);
          setScanStatus(fallback.length > 0 ? "success" : "error");
        }
      } catch {
        // No barcode found — search by filename hint or show error
        URL.revokeObjectURL(url);
        setScanStatus("error");
        setResults([]);
      }
    } catch {
      setScanStatus("error");
      setResults([]);
    }

    setLoading(false);
    setTimeout(() => setScanStatus("idle"), 2000);
    // reset input so same file can be re-selected
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      <h2 className="section-title">{t("bookInfo", lang)}</h2>

      {/* Search bar */}
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

      {/* Image / Barcode search buttons */}
      <div className="flex gap-2">
        <button
          onClick={scanMode ? stopScan : startScan}
          className={`flex items-center gap-1.5 text-sm font-bold px-3 py-2 rounded-xl border-2 transition-colors flex-1 justify-center ${
            scanMode
              ? "bg-destructive/10 border-destructive text-destructive"
              : "bg-secondary border-primary/20 hover:border-primary text-foreground"
          }`}
        >
          {scanMode ? (
            <><X className="w-4 h-4" />{t("stopScan", lang)}</>
          ) : (
            <><Camera className="w-4 h-4" />{t("scanBarcode", lang)}</>
          )}
        </button>

        <label className="flex items-center gap-1.5 text-sm font-bold px-3 py-2 rounded-xl border-2 border-primary/20 bg-secondary hover:border-primary transition-colors cursor-pointer flex-1 justify-center">
          <ImageUp className="w-4 h-4" />
          {t("uploadImageSearch", lang)}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageFile}
          />
        </label>
      </div>

      {/* Tip text */}
      <p className="text-xs text-muted-foreground text-center">{t("imageSearchTip", lang)}</p>

      {/* Camera preview */}
      {scanMode && (
        <div className="relative rounded-2xl overflow-hidden border-2 border-primary/40 bg-black">
          <video ref={videoRef} className="w-full max-h-64 object-cover" autoPlay muted playsInline />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-28 border-2 border-primary rounded-xl opacity-70" />
          </div>
          <div className="absolute bottom-2 left-0 right-0 flex justify-center">
            <span className="bg-black/60 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
              <ZapIcon className="w-3 h-3 text-yellow-400" />
              {t("scanningCamera", lang)}
            </span>
          </div>
        </div>
      )}

      {/* Scan status */}
      {scanStatus === "success" && !scanMode && (
        <p className="text-center text-sm font-bold text-primary">{t("scanSuccess", lang)}</p>
      )}
      {scanStatus === "error" && (
        <p className="text-center text-sm font-bold text-destructive">{t("scanError", lang)}</p>
      )}

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

      {searched && !loading && results.length === 0 && scanStatus !== "error" && (
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
