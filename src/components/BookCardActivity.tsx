import { useRef } from "react";
import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";
import DrawingCanvas from "./DrawingCanvas";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const EMOJI_LIST = [
  "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "🥲", "☺️", 
  "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", 
  "😎", "🤓", "🧐", "🥳", "🤩", "🤪", "🥺", "🥹", "🥸", "😎", 
  "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐻‍❄️", "🐨", 
  "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐧", "🐦", "🐤", "🦉",
  "📚", "📕", "📘", "📗", "📙", "📖", "📝", "✏️", "🎨", "🎭"
];

export default function BookCardActivity() {
  const { lang, bookCard, setBookCard, selectedBook } = useAppStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setBookCard({ uploadedImageUrl: reader.result as string });
    reader.readAsDataURL(file);
    // Reset file input
    if (fileRef.current) fileRef.current.value = "";
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
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-muted-foreground">{t("charLikes", lang)}</label>
            <input
              className="input-cute w-full mt-1"
              value={bookCard.charLikes}
              onChange={(e) => setBookCard({ charLikes: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground">{t("charDislikes", lang)}</label>
            <input
              className="input-cute w-full mt-1"
              value={bookCard.charDislikes}
              onChange={(e) => setBookCard({ charDislikes: e.target.value })}
            />
          </div>
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
            <Popover>
              <PopoverTrigger asChild>
                <button className="input-cute w-full mt-1 h-10 flex items-center justify-center text-2xl hover:bg-secondary transition-colors">
                  {bookCard.charEmoji || "📚"}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2" align="end">
                <div className="grid grid-cols-6 gap-1 max-h-48 overflow-y-auto custom-scrollbar">
                  {EMOJI_LIST.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setBookCard({ charEmoji: emoji })}
                      className="text-2xl hover:bg-secondary rounded p-1 transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
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
