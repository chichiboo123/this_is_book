import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";

export default function IntroCardPreview() {
  const { introText, selectedBook, lang } = useAppStore();

  return (
    <div className="rounded-2xl p-5 bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/20 space-y-3">
      <h3 className="font-title text-lg text-center">📝 {t("introCardTitle", lang)}</h3>
      {selectedBook && (
        <p className="text-xs text-muted-foreground text-center">
          📖 {selectedBook.title} — {selectedBook.authors?.join(", ")}
        </p>
      )}
      <p className="text-sm whitespace-pre-wrap leading-relaxed bg-card/60 rounded-xl p-3">
        {introText || t("introPlaceholder", lang)}
      </p>
    </div>
  );
}
