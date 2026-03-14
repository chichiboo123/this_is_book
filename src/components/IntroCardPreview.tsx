import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";

export default function IntroCardPreview() {
  const { introText, introImageUrl, selectedBook, customTitle, showIntroBookCover, lang } = useAppStore();

  return (
    <div className="rounded-2xl p-5 bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/20 space-y-3">
      <h3 className="font-title text-lg text-center">📝 {t("introCardTitle", lang)}</h3>
      {selectedBook && (
        <p className="text-xs text-muted-foreground text-center">
          📖 {customTitle || selectedBook.title} — {selectedBook.authors?.join(", ")}
        </p>
      )}
      {showIntroBookCover && selectedBook?.imageLinks?.thumbnail && (
        <div className="flex justify-center">
          <img
            src={selectedBook.imageLinks.thumbnail}
            alt="book cover"
            className="w-24 object-cover rounded-xl shadow-md"
          />
        </div>
      )}
      {introImageUrl && (
        <img
          src={introImageUrl}
          alt="intro"
          className="w-full max-h-48 object-contain rounded-xl"
        />
      )}
      <p className="text-sm whitespace-pre-wrap leading-relaxed bg-card/60 rounded-xl p-3">
        {introText || t("introPlaceholder", lang)}
      </p>
    </div>
  );
}
