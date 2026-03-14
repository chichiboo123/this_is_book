import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";

export default function BookCardPreview() {
  const { bookCard, selectedBook, customTitle, lang } = useAppStore();

  return (
    <div
      className="rounded-2xl p-5 space-y-3"
      style={{
        background: `linear-gradient(135deg, ${bookCard.charColor}33, ${bookCard.charColor}11)`,
        border: `2px solid ${bookCard.charColor}55`,
      }}
    >
      <div className="text-center">
        {bookCard.charEmoji && <span className="text-4xl">{bookCard.charEmoji}</span>}
        <h3 className="font-title text-xl mt-1">{bookCard.charName || "..."}</h3>
        {selectedBook && (
          <p className="text-xs text-muted-foreground mt-0.5">
            📖 {customTitle || selectedBook.title}
          </p>
        )}
      </div>

      {bookCard.showBookCover && selectedBook?.imageLinks?.thumbnail && (
        <div className="flex justify-center">
          <img
            src={selectedBook.imageLinks.thumbnail}
            alt="book cover"
            className="w-24 h-34 object-cover rounded-xl shadow-md"
          />
        </div>
      )}

      {(bookCard.uploadedImageUrl || bookCard.drawingDataUrl) && (
        <div className="flex justify-center">
          <img
            src={bookCard.uploadedImageUrl || bookCard.drawingDataUrl || ""}
            alt="character"
            className="w-32 h-32 object-contain rounded-xl"
          />
        </div>
      )}

      <div className="space-y-1.5 text-sm">
        {bookCard.charLikes && (
          <p><span className="font-bold">👍 {t("charLikes", lang)}:</span> {bookCard.charLikes}</p>
        )}
        {bookCard.charDislikes && (
          <p><span className="font-bold">👎 {t("charDislikes", lang)}:</span> {bookCard.charDislikes}</p>
        )}
        {bookCard.charLook && (
          <p><span className="font-bold">👀 {t("charLook", lang)}:</span> {bookCard.charLook}</p>
        )}
        {bookCard.charPhrase && (
          <p className="italic bg-card/50 rounded-lg p-2 text-center">
            "{bookCard.charPhrase}"
          </p>
        )}
      </div>

      <div className="flex justify-center">
        <div
          className="w-8 h-8 rounded-full border-2 border-card"
          style={{ backgroundColor: bookCard.charColor }}
        />
      </div>
    </div>
  );
}
