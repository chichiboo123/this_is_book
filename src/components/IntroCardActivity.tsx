import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";

export default function IntroCardActivity() {
  const { lang, introText, setIntroText, selectedBook } = useAppStore();

  return (
    <div className="space-y-4">
      <h2 className="section-title">{t("introCardTitle", lang)}</h2>
      {selectedBook && (
        <p className="text-sm text-muted-foreground">
          📖 {selectedBook.title} — {selectedBook.authors?.join(", ")}
        </p>
      )}
      <p className="text-sm text-foreground">{t("introText", lang)}</p>
      <textarea
        className="textarea-cute w-full min-h-[160px]"
        placeholder={t("introPlaceholder", lang)}
        value={introText}
        onChange={(e) => setIntroText(e.target.value)}
      />
    </div>
  );
}
