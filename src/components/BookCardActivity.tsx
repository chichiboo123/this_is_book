import { useRef, useState } from "react";
import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";
import DrawingCanvas from "./DrawingCanvas";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const EMOJI_LIST = [
  "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "🥲", "☺️",
  "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗",
  "😎", "🤓", "🧐", "🥳", "🤩", "🤪", "🥺", "🥹", "🥸", "😤",
  "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐻‍❄️", "🐨",
  "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐧", "🐦", "🐤", "🦉",
  "📚", "📕", "📘", "📗", "📙", "📖", "📝", "✏️", "🎨", "🎭",
  "⭐", "🌟", "💫", "✨", "🌈", "🌸", "🌺", "🍀", "🔥", "💎",
];

export default function BookCardActivity() {
  const { lang, bookCard, setBookCard, selectedBook, customTitle, setCustomTitle } = useAppStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [customEmoji, setCustomEmoji] = useState("");

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setBookCard({ uploadedImageUrl: reader.result as string });
    reader.readAsDataURL(file);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleCustomEmojiSubmit = () => {
    if (customEmoji.trim()) {
      setBookCard({ charEmoji: customEmoji.trim() });
      setCustomEmoji("");
      setEmojiOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="section-title">{t("bookCardTitle", lang)}</h2>
      {selectedBook && (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <span className="shrink-0">📖</span>
          <input
            className="bg-transparent border-b border-dashed border-muted-foreground/40 focus:border-primary focus:outline-none flex-1 min-w-0 text-sm text-muted-foreground px-0.5"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            title="책 제목을 직접 수정할 수 있어요"
          />
          <span className="shrink-0 text-xs">— {selectedBook.authors?.join(", ")}</span>
        </div>
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
            <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
              <PopoverTrigger asChild>
                <button className="input-cute w-full mt-1 h-10 flex items-center justify-center text-2xl hover:bg-secondary transition-colors">
                  {bookCard.charEmoji || <span className="text-sm text-muted-foreground">선택</span>}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-3" align="end">
                <p className="text-xs font-bold text-muted-foreground mb-2">{t("emojiPickerTitle", lang)}</p>
                <div className="grid grid-cols-7 gap-1 max-h-48 overflow-y-auto custom-scrollbar mb-3">
                  {EMOJI_LIST.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => { setBookCard({ charEmoji: emoji }); setEmojiOpen(false); }}
                      className="text-xl hover:bg-secondary rounded p-1 transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <div className="border-t border-border pt-2">
                  <p className="text-xs text-muted-foreground mb-1.5">{t("emojiCustom", lang)}</p>
                  <div className="flex gap-2">
                    <input
                      className="input-cute flex-1 text-center text-lg h-9"
                      value={customEmoji}
                      onChange={(e) => setCustomEmoji(e.target.value)}
                      placeholder="✍️"
                      maxLength={4}
                    />
                    <button
                      onClick={handleCustomEmojiSubmit}
                      className="btn-cute px-3 h-9 text-xs"
                    >
                      확인
                    </button>
                  </div>
                </div>
                {bookCard.charEmoji && (
                  <button
                    onClick={() => { setBookCard({ charEmoji: "" }); setEmojiOpen(false); }}
                    className="w-full mt-2 text-xs text-muted-foreground hover:text-destructive transition-colors"
                  >
                    ✕ 이모지 제거
                  </button>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Upload or Draw */}
      <div className="space-y-3">
        <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />

        {bookCard.uploadedImageUrl ? (
          <div className="space-y-2 border-2 border-primary/20 rounded-xl p-3 bg-card/50">
            <img
              src={bookCard.uploadedImageUrl}
              alt="uploaded"
              className="w-full max-h-48 object-contain rounded-lg"
            />
            <div className="flex gap-2">
              <button onClick={() => fileRef.current?.click()} className="btn-outline-cute flex-1 py-1.5 text-xs">
                📷 변경
              </button>
              <button onClick={() => setBookCard({ uploadedImageUrl: null })} className="btn-outline-cute border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground py-1.5 px-3">
                ❌
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => fileRef.current?.click()} className="btn-outline-cute w-full">
            📷 {t("uploadDrawing", lang)}
          </button>
        )}

        <DrawingCanvas />
      </div>
    </div>
  );
}
