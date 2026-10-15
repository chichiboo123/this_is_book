import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";
import CardShell from "./CardShell";

export default function IntroCardPreview() {
  const { introText, introImageUrl, introRating, selectedBook, customTitle, showIntroBookCover, lang } = useAppStore();
  const title = customTitle || selectedBook?.title;
  const cover = showIntroBookCover ? selectedBook?.imageLinks?.thumbnail : undefined;

  return (
    <CardShell>
      <div className="px-5 pt-4 pb-3 bg-gradient-to-br from-primary/45 to-accent/40">
        <p className="text-[10px] font-bold tracking-[0.2em] text-[#1f2430]/70">BOOK RECOMMENDATION</p>
        <h3 className="font-title text-[22px] mt-0.5">📣 {t("introText", lang)}</h3>
      </div>

      <div className="p-5 space-y-4">
        {(title || cover || introRating > 0) && (
          <div className="flex gap-4 items-center">
            {cover && <img src={cover} alt="" className="w-20 h-28 object-cover rounded-lg shadow-md shrink-0" />}
            <div className="min-w-0 space-y-1">
              {title && <p className="font-title text-xl leading-snug break-keep">{title}</p>}
              {selectedBook?.authors?.length ? (
                <p className="text-xs text-[#5c6170]">{selectedBook.authors.join(", ")}</p>
              ) : null}
              {introRating > 0 && (
                <p className="text-sm" aria-label={t("ratingStar", lang, { n: introRating })}>
                  <span className="text-[11px] font-bold text-[#767676] mr-1.5">{t("rating", lang)}</span>
                  {"⭐".repeat(introRating)}
                  <span className="opacity-25 grayscale">{"⭐".repeat(5 - introRating)}</span>
                </p>
              )}
            </div>
          </div>
        )}

        <div className="relative rounded-2xl bg-primary/10 px-5 pt-6 pb-4">
          <span className="absolute -top-1 left-3 text-5xl leading-none font-title text-primary-strong/40" aria-hidden="true">“</span>
          <p className={`text-[15px] whitespace-pre-wrap leading-relaxed break-keep ${introText ? "" : "text-[#9aa0aa]"}`}>
            {introText || t("introPlaceholder", lang)}
          </p>
        </div>

        {introImageUrl && <img src={introImageUrl} alt="" className="w-full max-h-60 object-contain rounded-2xl" />}
      </div>
    </CardShell>
  );
}
