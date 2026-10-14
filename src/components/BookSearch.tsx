import { useState, useRef, useEffect } from "react";
import { useAppStore, type BookInfo } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";
import { searchBooks, PROVIDER_LABEL, type BookProvider } from "@/lib/bookSearch";
import { hasAnyContent } from "@/lib/progress";
import { BOOK_SEARCH_INPUT_ID } from "@/lib/nav";
import Icon from "@/components/Icon";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function BookSearch() {
  const { lang, setSelectedBook, selectedBook, setCustomTitle, clearContent } = useAppStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BookInfo[]>([]);
  const [provider, setProvider] = useState<BookProvider>("kakao");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [changing, setChanging] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  // 직접 입력
  const [manualOpen, setManualOpen] = useState(false);
  const [manualTitle, setManualTitle] = useState("");
  const [manualAuthor, setManualAuthor] = useState("");

  // OCR
  const [ocrStatus, setOcrStatus] = useState<"idle" | "ocr" | "done" | "error">("idle");
  const [ocrErrorKey, setOcrErrorKey] = useState("scanError");
  const [ocrText, setOcrText] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 카메라
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const showSearchUi = !selectedBook || changing;

  const handleSearch = async (searchQuery?: string) => {
    const q = (searchQuery ?? query).trim();
    if (!q) {
      searchInputRef.current?.focus();
      return;
    }
    setLoading(true);
    setSearched(true);
    setSearchError(false);
    try {
      const res = await searchBooks(q);
      setResults(res.books);
      setProvider(res.provider);
    } catch (err) {
      console.error("Search error:", err);
      setSearchError(true);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const resetSearchUi = () => {
    setResults([]);
    setSearched(false);
    setSearchError(false);
    setManualOpen(false);
    setChanging(false);
  };

  const handleSelect = (book: BookInfo) => {
    setSelectedBook(book);
    setCustomTitle(book.title);
    resetSearchUi();
    clearOcr();
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const title = manualTitle.trim();
    if (!title) return;
    handleSelect({ title, authors: manualAuthor.trim() ? [manualAuthor.trim()] : [] });
    setManualTitle("");
    setManualAuthor("");
  };

  const executeClear = () => {
    setQuery("");
    resetSearchUi();
    clearContent();
  };

  const handleStartOver = () => {
    if (hasAnyContent(useAppStore.getState())) setConfirmClearOpen(true);
    else executeClear();
  };

  const startChanging = () => {
    setChanging(true);
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  // ── OCR ───────────────────────────────────────────────────────
  const clearOcr = () => {
    setOcrText("");
    setOcrStatus("idle");
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsCameraOpen(false);
  };

  const startCamera = async () => {
    clearOcr();
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Camera error:", err);
      setIsCameraOpen(false);
      setOcrErrorKey("cameraError");
      setOcrStatus("error");
    }
  };

  useEffect(() => () => streamRef.current?.getTracks().forEach((track) => track.stop()), []);

  const runOcr = async (file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setOcrStatus("ocr");
    setOcrText("");
    try {
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("kor+eng");
      const { data } = await worker.recognize(url);
      await worker.terminate();
      // 표지 윗부분(제목일 가능성이 높은) 3줄만 사용
      const cleaned = data.text
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 1)
        .slice(0, 3)
        .join(" ")
        .substring(0, 80);
      setOcrText(cleaned);
      setOcrStatus("done");
    } catch {
      setOcrErrorKey("scanError");
      setOcrStatus("error");
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      stopCamera();
      runOcr(new File([blob], "capture.jpg", { type: "image/jpeg" }));
    }, "image/jpeg");
  };

  const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      stopCamera();
      runOcr(file);
    }
  };

  const handleOcrSearch = () => {
    if (!ocrText.trim()) return;
    setQuery(ocrText);
    handleSearch(ocrText);
  };

  return (
    <section id="step-pick" className="card-activity space-y-4 scroll-mt-20">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2.5 section-title">
          <span className="step-badge">1</span>
          {t("stepPick", lang)}
        </h2>
        {selectedBook && (
          <button onClick={handleStartOver} className="btn-ghost-cute hover:text-destructive">
            <Icon name="restart_alt" size={18} />
            {t("startOver", lang)}
          </button>
        )}
      </div>

      {selectedBook && !changing && <SelectedBookSummary book={selectedBook} onChange={startChanging} />}

      {showSearchUi && (
        <div className="space-y-3">
          {/* 검색창 */}
          <form
            role="search"
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
            <div className="relative flex-1 min-w-0">
              <Icon name="search" size={20} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={searchInputRef}
                id={BOOK_SEARCH_INPUT_ID}
                type="search"
                enterKeyHint="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("searchPlaceholder", lang)}
                aria-label={t("searchPlaceholder", lang)}
                className="input-cute w-full pl-11 h-12 [&::-webkit-search-cancel-button]:hidden"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    searchInputRef.current?.focus();
                  }}
                  aria-label={t("removeImage", lang)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-secondary"
                >
                  <Icon name="close" size={18} />
                </button>
              )}
            </div>
            <button type="submit" className="btn-cute h-12 px-5 sm:px-6" disabled={loading}>
              {loading ? <Icon name="autorenew" size={18} className="animate-spin" /> : <Icon name="search" size={18} className="sm:hidden" />}
              <span className="hidden sm:inline">{loading ? t("searching", lang) : t("search", lang)}</span>
            </button>
          </form>

          {/* 표지 사진으로 찾기 */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={isCameraOpen ? stopCamera : startCamera}
              className={`chip ${isCameraOpen ? "border-destructive text-destructive" : ""}`}
            >
              <Icon name={isCameraOpen ? "close" : "photo_camera"} size={18} />
              {isCameraOpen ? t("stopScan", lang) : t("scanBarcode", lang)}
            </button>
            <label className="chip cursor-pointer focus-within:ring-2 focus-within:ring-ring">
              <Icon name="add_photo_alternate" size={18} />
              {t("uploadImageSearch", lang)}
              <input ref={imageInputRef} type="file" accept="image/*" className="sr-only" onChange={handleImageInput} />
            </label>
            <span className="text-xs text-muted-foreground">{t("imageSearchTip", lang)}</span>
          </div>

          {isCameraOpen && (
            <div className="relative rounded-2xl overflow-hidden border-2 border-primary/40 bg-black">
              <video ref={videoRef} autoPlay playsInline muted className="w-full max-h-72 object-cover" />
              <div className="absolute bottom-4 inset-x-0 flex justify-center">
                <button onClick={captureImage} className="btn-cute shadow-lg">
                  <Icon name="photo_camera" size={18} />
                  {t("captureButton", lang)}
                </button>
              </div>
            </div>
          )}

          {!isCameraOpen && (ocrStatus !== "idle" || previewUrl) && (
            <div className="rounded-2xl border border-border bg-secondary/40 p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-sm flex items-center gap-2" role="status">
                  {ocrStatus === "ocr" && (
                    <>
                      <Icon name="autorenew" size={18} className="animate-spin text-primary-strong" />
                      {t("scanningCamera", lang)}
                    </>
                  )}
                  {ocrStatus === "done" && (
                    <>
                      <Icon name="text_fields" size={18} className="text-primary-strong" />
                      {t("ocrResult", lang)}
                    </>
                  )}
                  {ocrStatus === "error" && (
                    <span className="text-destructive flex items-center gap-1.5">
                      <Icon name="error_outline" size={18} />
                      {t(ocrErrorKey, lang)}
                    </span>
                  )}
                </span>
                <button onClick={clearOcr} aria-label={t("close", lang)} className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-card">
                  <Icon name="close" size={18} />
                </button>
              </div>
              {previewUrl && (
                <img src={previewUrl} alt="" className="w-full max-h-40 object-contain rounded-xl bg-card" />
              )}
              {ocrStatus === "done" && (
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-bold" htmlFor="ocr-text">
                    {t("ocrEditHint", lang)}
                  </label>
                  <div className="flex gap-2">
                    <input id="ocr-text" value={ocrText} onChange={(e) => setOcrText(e.target.value)} className="input-cute flex-1 min-w-0" />
                    <button onClick={handleOcrSearch} disabled={!ocrText.trim() || loading} className="btn-cute">
                      <Icon name="search" size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 결과 */}
          {loading && (
            <div className="space-y-2" aria-busy="true">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex gap-3 p-3 rounded-2xl bg-secondary/40 animate-pulse">
                  <div className="w-12 h-[68px] rounded-md bg-secondary" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 w-2/3 rounded bg-secondary" />
                    <div className="h-3 w-1/3 rounded bg-secondary" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="rounded-2xl border border-border overflow-hidden">
              <p className="flex items-center justify-between gap-2 px-4 py-2.5 text-sm font-bold bg-secondary/50 border-b border-border" role="status">
                {t("resultsCount", lang, { n: results.length })}
                <span className="text-xs font-medium text-muted-foreground">
                  {t("searchSource", lang, { name: PROVIDER_LABEL[provider] })}
                </span>
              </p>
              <ul className="max-h-[22rem] overflow-y-auto divide-y divide-border">
                {results.map((book, i) => (
                  <li key={`${book.id ?? "b"}-${i}`}>
                    <button
                      onClick={() => handleSelect(book)}
                      className="w-full flex gap-3 items-center text-left px-3 py-2.5 hover:bg-primary/10 focus-visible:bg-primary/10 transition-colors group"
                    >
                      <BookThumb book={book} className="w-12 h-[68px]" />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-[15px] leading-snug line-clamp-2">{book.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{book.authors?.join(", ")}</p>
                        <p className="text-xs text-muted-foreground/90 truncate">
                          {[book.publisher, book.publishedDate?.slice(0, 4)].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                      <Icon name="chevron_right" size={22} className="text-muted-foreground group-hover:text-primary-strong" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!loading && searchError && (
            <p className="flex items-center gap-2 text-destructive text-sm p-3 bg-destructive/10 rounded-2xl" role="alert">
              <Icon name="error_outline" size={18} />
              {t("searchFailed", lang)}
            </p>
          )}

          {searched && !loading && !searchError && results.length === 0 && (
            <p className="text-center text-muted-foreground py-3">{t("noResults", lang)}</p>
          )}

          {/* 직접 입력 */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            <span className="text-muted-foreground">{t("manualEntryPrompt", lang)}</span>
            <button
              type="button"
              onClick={() => setManualOpen((o) => !o)}
              aria-expanded={manualOpen}
              className="font-bold text-primary-strong underline underline-offset-4 decoration-2 decoration-primary/60 hover:decoration-primary-strong"
            >
              {t("manualEntry", lang)}
            </button>
            {changing && (
              <button type="button" onClick={resetSearchUi} className="ml-auto btn-ghost-cute">
                {t("cancel", lang)}
              </button>
            )}
          </div>
          {manualOpen && (
            <form onSubmit={handleManualSubmit} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto] p-3 rounded-2xl bg-secondary/40">
              <input
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
                placeholder={t("manualTitle", lang)}
                aria-label={t("manualTitle", lang)}
                className="input-cute"
                required
              />
              <input
                value={manualAuthor}
                onChange={(e) => setManualAuthor(e.target.value)}
                placeholder={`${t("manualAuthor", lang)} (${t("optional", lang)})`}
                aria-label={t("manualAuthor", lang)}
                className="input-cute"
              />
              <button type="submit" className="btn-cute" disabled={!manualTitle.trim()}>
                <Icon name="check" size={18} />
                {t("manualSubmit", lang)}
              </button>
            </form>
          )}
        </div>
      )}

      <ConfirmDialog
        open={confirmClearOpen}
        onOpenChange={setConfirmClearOpen}
        emoji="📚"
        title={t("startOverTitle", lang)}
        description={t("startOverDesc", lang)}
        confirmLabel={t("startOver", lang)}
        onConfirm={executeClear}
      />
    </section>
  );
}

function BookThumb({ book, className = "" }: { book: BookInfo; className?: string }) {
  const [failed, setFailed] = useState(false);
  const src = book.imageLinks?.thumbnail;
  if (!src || failed) {
    return (
      <div className={`${className} rounded-md bg-secondary flex items-center justify-center text-muted-foreground shrink-0`}>
        <Icon name="menu_book" size={22} />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
      className={`${className} rounded-md object-cover shadow-sm shrink-0 bg-secondary`}
    />
  );
}

function SelectedBookSummary({ book, onChange }: { book: BookInfo; onChange: () => void }) {
  const lang = useAppStore((s) => s.lang);
  const [open, setOpen] = useState(false);

  const detailRows: [string, string | undefined][] = [
    [t("publisher", lang), book.publisher],
    [t("publishedDate", lang), book.publishedDate],
    [t("pages", lang), book.pageCount?.toString()],
    [t("categories", lang), book.categories?.join(", ")],
    ["ISBN", book.isbn13 ?? book.isbn10],
  ];
  const hasDetails = detailRows.some(([, v]) => v) || !!book.description;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-primary/15 to-accent/20 border border-primary/25 p-4 space-y-3">
      <div className="flex gap-4">
        <BookThumb book={book} className="w-20 h-28 sm:w-24 sm:h-[134px] rounded-lg shadow-md" />
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-xs font-bold text-primary-strong flex items-center gap-1">
            <Icon name="check_circle" size={16} />
            {t("selectedBookLabel", lang)}
          </p>
          <p className="font-title text-xl sm:text-2xl leading-snug break-keep">{book.title}</p>
          {book.authors?.length > 0 && <p className="text-sm text-foreground/80">{book.authors.join(", ")}</p>}
          <p className="text-xs text-muted-foreground">
            {[book.publisher, book.publishedDate?.slice(0, 4)].filter(Boolean).join(" · ")}
          </p>
          <div className="flex flex-wrap gap-2 pt-1.5">
            <button onClick={onChange} className="chip text-[13px] py-1">
              <Icon name="swap_horiz" size={16} />
              {t("changeBook", lang)}
            </button>
            {hasDetails && (
              <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="chip text-[13px] py-1">
                <Icon name={open ? "expand_less" : "expand_more"} size={16} />
                {open ? t("hideDetails", lang) : t("showDetails", lang)}
              </button>
            )}
          </div>
        </div>
      </div>

      {open && (
        <div className="space-y-3 pt-1 animate-in fade-in slide-in-from-top-1 duration-200">
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
            {detailRows.map(([label, value]) =>
              value ? (
                <div key={label} className="contents">
                  <dt className="font-bold text-muted-foreground">{label}</dt>
                  <dd className="text-foreground break-all">{value}</dd>
                </div>
              ) : null
            )}
          </dl>
          <div>
            <p className="font-bold text-sm text-muted-foreground mb-1">{t("description", lang)}</p>
            <p className="text-sm leading-relaxed bg-card/80 rounded-xl p-3">
              {book.description || t("noDescription", lang)}
            </p>
          </div>
          {book.link && (
            <a
              href={book.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-bold text-primary-strong hover:underline"
            >
              {t("viewOnSource", lang)}
              <Icon name="open_in_new" size={16} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
