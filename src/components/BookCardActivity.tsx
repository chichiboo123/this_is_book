import { useRef } from "react";
import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";
import DrawingCanvas from "./DrawingCanvas";

export default function BookCardActivity() {
  const { lang, bookCard, setBookCard, selectedBook } = useAppStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setBookCard({ uploadedImageUrl: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <h2 className="section-title">{t("bookCardTitle", lang)}</h2>
      {selectedBook && (
        <p className="text-sm text-muted-foreground">
          📖 {selectedBook.title} — {selectedBook.authors?.join(", ")}
        </p>
      )}

      <div className="grid gap-3">
        <div>
          <label className="text-xs font-bold text-muted-foreground">{t("charName", lang)}</label>
          <input
            className="input-cute w-full mt-1"
            value={bookCard.charName}
            onChange={(e) => setBookCard({ charName: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs font-bold text-muted-foreground">{t("charTaste", lang)}</label>
          <input
            className="input-cute w-full mt-1"
            value={bookCard.charTaste}
            onChange={(e) => setBookCard({ charTaste: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs font-bold text-muted-foreground">{t("charLook", lang)}</label>
          <input
            className="input-cute w-full mt-1"
            value={bookCard.charLook}
            onChange={(e) => setBookCard({ charLook: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs font-bold text-muted-foreground">{t("charPhrase", lang)}</label>
          <input
            className="input-cute w-full mt-1"
            value={bookCard.charPhrase}
            onChange={(e) => setBookCard({ charPhrase: e.target.value })}
            placeholder='"..."'
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-muted-foreground">{t("charColor", lang)}</label>
            <input
              type="color"
              className="w-full h-10 rounded-xl border-2 border-primary/30 cursor-pointer mt-1"
              value={bookCard.charColor}
              onChange={(e) => setBookCard({ charColor: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground">{t("charEmoji", lang)}</label>
            <input
              className="input-cute w-full mt-1 text-center text-2xl"
              value={bookCard.charEmoji}
              onChange={(e) => setBookCard({ charEmoji: e.target.value })}
              maxLength={4}
            />
          </div>
        </div>
      </div>

      {/* Upload or Draw */}
      <div className="space-y-3">
        <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        <button onClick={() => fileRef.current?.click()} className="btn-outline-cute w-full">
          📷 {t("uploadDrawing", lang)}
        </button>

        {bookCard.uploadedImageUrl && (
          <img
            src={bookCard.uploadedImageUrl}
            alt="uploaded"
            className="w-full max-h-48 object-contain rounded-xl border-2 border-primary/20"
          />
        )}

        <DrawingCanvas />
      </div>
    </div>
  );
}
