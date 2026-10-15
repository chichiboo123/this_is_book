import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";
import { readableTextColor } from "@/lib/image";
import CardShell from "./CardShell";

export default function BookCardPreview() {
  const { bookCard, selectedBook, customTitle, lang } = useAppStore();
  const color = bookCard.charColor || "#BFD9F2";
  const onColor = readableTextColor(color);
  const title = customTitle || selectedBook?.title;
  const cover = bookCard.showBookCover ? selectedBook?.imageLinks?.thumbnail : undefined;
  const charImage =
    bookCard.imageSource === "draw"
      ? bookCard.drawingDataUrl || bookCard.uploadedImageUrl
      : bookCard.uploadedImageUrl || bookCard.drawingDataUrl;

  const rows: [string, string, string][] = [
    ["👍", t("charLikes", lang), bookCard.charLikes],
    ["👎", t("charDislikes", lang), bookCard.charDislikes],
    ["👀", t("charLook", lang), bookCard.charLook],
  ].filter(([, , v]) => v.trim()) as [string, string, string][];

  return (
    <CardShell borderColor={`${color}`}>
      {/* 상단 색 띠 */}
      <div
        className="relative h-24 px-5 pt-3 flex items-start justify-between"
        style={{ background: `linear-gradient(135deg, ${color}, ${color}B3)`, color: onColor }}
      >
        <span className="text-[10px] font-bold tracking-[0.2em] opacity-80">BOOK CHARACTER</span>
        <span className="text-[10px] font-bold tracking-[0.2em] opacity-80">{t("bookCard", lang)}</span>
      </div>

      <div className="relative px-5 pb-5 -mt-11 space-y-4">
        {/* 아바타 + 이름 */}
        <div className="flex flex-col items-center text-center">
          <div
            className="w-[88px] h-[88px] rounded-full bg-white flex items-center justify-center text-5xl border-4 shadow-md"
            style={{ borderColor: "#fff" }}
          >
            {bookCard.charEmoji || "📖"}
          </div>
          <h3 className={`font-title text-[26px] leading-tight mt-2 break-keep ${bookCard.charName ? "" : "text-[#b0b4bc]"}`}>
            {bookCard.charName || t("charNameEmpty", lang)}
          </h3>
          {title && (
            <p className="mt-1 inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: `${color}40` }}>
              📖 {title}
            </p>
          )}
        </div>

        {/* 그림 · 표지 */}
        {(charImage || cover) && (
          <div className="flex justify-center items-end gap-3">
            {charImage && (
              <img src={charImage} alt="" className="w-44 h-44 object-contain rounded-2xl" style={{ backgroundColor: `${color}26` }} />
            )}
            {cover && <img src={cover} alt="" className="w-20 h-28 object-cover rounded-lg shadow-md" />}
          </div>
        )}

        {/* 정보 */}
        {rows.length > 0 && (
          <dl className="space-y-1.5">
            {rows.map(([emoji, label, value]) => (
              <div key={label} className="flex gap-2 rounded-xl px-3 py-2 text-sm" style={{ backgroundColor: `${color}22` }}>
                <dt className="font-bold shrink-0 whitespace-nowrap">
                  {emoji} {label}
                </dt>
                <dd className="break-keep">{value}</dd>
              </div>
            ))}
          </dl>
        )}

        {/* 자주 하는 말 — 말풍선 */}
        {bookCard.charPhrase.trim() && (
          <div className="relative mt-1">
            <p className="text-[11px] font-bold text-[#767676] mb-1">💬 {t("charPhrase", lang)}</p>
            <p
              className="rounded-2xl rounded-tl-sm px-4 py-3 text-[15px] font-bold leading-snug break-keep"
              style={{ backgroundColor: `${color}55` }}
            >
              “{bookCard.charPhrase}”
            </p>
          </div>
        )}
      </div>
    </CardShell>
  );
}
