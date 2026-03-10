import { useState, useRef, useEffect } from "react";
import { useAppStore, type BookInfo } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";
import { searchBooks } from "@/lib/naverBooks";
import { Search, Camera, ImageUp, X, Loader2 } from "lucide-react";
import { createWorker } from "tesseract.js";

export default function BookSearch() {
  const { lang, setSelectedBook, selectedBook } = useAppStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BookInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // OCR state
  const [ocrStatus, setOcrStatus] = useState<"idle" | "ocr" | "done" | "error">("idle");
  const [ocrText, setOcrText] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Camera state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async (searchQuery?: string) => {
    const q = (searchQuery ?? query).trim();
    if (!q) return;
    setLoading(true);
    setSearched(true);
    setSearchError(null);
    try {
      const books = await searchBooks(q);
      setResults(books);
    } catch (err) {
      console.error("Search error:", err);
      setSearchError(err instanceof Error ? err.message : "검색 중 오류가 발생했습니다.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (book: BookInfo) => {
    setSelectedBook(book);
    setResults([]);
    setSearched(false);
  };

  const clearOcr = () => {
    setOcrText("");
    setOcrStatus("idle");
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  // ── Camera Handling ───────────────────────────────────────────
  const startCamera = async () => {
    clearOcr();
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      setIsCameraOpen(false);
      setOcrStatus("error");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const captureImage = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
        stopCamera();
        runOcr(file);
      }
    }, "image/jpeg");
  };

  // ── OCR with Tesseract ─────────────────────────────────────────
  const runOcr = async (file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setOcrStatus("ocr");
    setOcrText("");

    try {
      const worker = await createWorker("kor+eng");
      const { data } = await worker.recognize(url);
      await worker.terminate();

      // Clean up text: remove excess whitespace, keep meaningful lines
      const cleaned = data.text
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 1)
        .slice(0, 3) // Take top 3 lines as likely title area
        .join(" ")
        .substring(0, 80);

      setOcrText(cleaned);
      setOcrStatus("done");
    } catch {
      setOcrStatus("error");
    }
  };

  const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      stopCamera();
      runOcr(file);
    }
  };

  const handleOcrSearch = () => {
    if (ocrText.trim()) {
      setQuery(ocrText);
      handleSearch(ocrText);
    }
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
        <button onClick={() => handleSearch()} className="btn-cute" disabled={loading}>
          {loading ? t("searching", lang) : t("search", lang)}
        </button>
      </div>

      {/* Camera & Image buttons */}
      <div className="flex gap-2">
        <button
          onClick={isCameraOpen ? stopCamera : startCamera}
          className={`flex items-center gap-1.5 text-sm font-bold px-3 py-2 rounded-xl border-2 transition-colors flex-1 justify-center ${
            isCameraOpen
              ? "bg-destructive/10 border-destructive text-destructive"
              : "border-primary/20 bg-secondary hover:border-primary text-foreground"
          }`}
        >
          {isCameraOpen ? (
            <>
              <X className="w-4 h-4" />
              {t("stopScan", lang)}
            </>
          ) : (
            <>
              <Camera className="w-4 h-4" />
              {t("scanBarcode", lang)}
            </>
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
            onChange={handleImageInput}
          />
        </label>
      </div>
      <p className="text-xs text-muted-foreground text-center">{t("imageSearchTip", lang)}</p>

      {/* Live Camera View */}
      {isCameraOpen && (
        <div className="relative rounded-2xl overflow-hidden border-2 border-primary/40 bg-black flex flex-col items-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full max-h-64 object-cover"
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <button
              onClick={captureImage}
              className="bg-primary text-primary-foreground font-bold px-6 py-2 rounded-full shadow-lg border-2 border-white/20 active:scale-95 transition-transform"
            >
              {t("captureButton", lang)}
            </button>
          </div>
        </div>
      )}

      {/* OCR Panel */}
      {!isCameraOpen && (ocrStatus !== "idle" || previewUrl) && (
        <div className="rounded-2xl border-2 border-primary/20 bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-foreground">
              {ocrStatus === "ocr" && (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  {t("scanningCamera", lang)}
                </span>
              )}
              {ocrStatus === "done" && "📝 " + t("ocrResult", lang)}
              {ocrStatus === "error" && "⚠️ " + t("scanError", lang)}
            </span>
            <button onClick={clearOcr} className="text-muted-foreground hover:text-destructive transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {previewUrl && (
            <img
              src={previewUrl}
              alt="captured"
              className="w-full max-h-40 object-contain rounded-xl border border-border"
            />
          )}

          {ocrStatus === "done" && (
            <>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-bold">{t("ocrEditHint", lang)}</p>
                <input
                  type="text"
                  value={ocrText}
                  onChange={(e) => setOcrText(e.target.value)}
                  className="input-cute w-full"
                />
              </div>
              <button
                onClick={handleOcrSearch}
                disabled={!ocrText.trim() || loading}
                className="btn-cute w-full"
              >
                {loading ? t("searching", lang) : t("search", lang)}
              </button>
            </>
          )}
        </div>
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

      {searchError && (
        <p className="text-center text-destructive text-sm py-3 bg-destructive/10 rounded-xl px-3">
          ⚠️ {searchError}
        </p>
      )}

      {searched && !loading && !searchError && results.length === 0 && (
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
    [lang === "ko" ? "부제" : "Subtitle", book.subtitle],
    [t("author", lang), book.authors?.join(", ")],
    [t("publisher", lang), book.publisher],
    [t("publishedDate", lang), book.publishedDate],
    [t("pages", lang), book.pageCount?.toString()],
    [lang === "ko" ? "출판 형태" : "Print Type", book.printType],
    [t("categories", lang), book.categories?.join(", ")],
    [t("isbn", lang), book.isbn],
    ["ISBN-13", book.isbn13],
    ["ISBN-10", book.isbn10],
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
      <div>
        <p className="font-bold text-sm text-primary-foreground/70 mb-1">{t("description", lang)}</p>
        <p className="text-sm text-foreground leading-relaxed bg-secondary/50 rounded-xl p-3">
          {book.description || (lang === "ko" ? "설명 정보가 없습니다." : "No description available.")}
        </p>
      </div>
    </div>
  );
}
