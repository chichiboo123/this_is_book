import { useState } from "react";
import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";
import DrawingCanvas from "./DrawingCanvas";
import BookContextBar from "./BookContextBar";
import ImageAttach from "./ImageAttach";
import Icon from "./Icon";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const EMOJI_LIST = [
  "😀", "😄", "😆", "😂", "🥲", "😊", "😇", "🙂", "😉", "😍",
  "🥰", "😎", "🤓", "🧐", "🥳", "🤩", "🤪", "🥺", "😤", "😴",
  "🐶", "🐱", "🐭", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁",
  "🐷", "🐸", "🐵", "🐧", "🐤", "🦉", "🦄", "🐉", "🐳", "🦋",
  "📚", "📖", "✏️", "🎨", "🎭", "🎵", "🚀", "🏰", "👑", "🧸",
  "⭐", "🌟", "✨", "🌈", "🌙", "☀️", "🌸", "🍀", "🔥", "💎",
];

/** 치수쌤 파스텔 팔레트 + 보조 색 */
const COLOR_PRESETS = ["#BFD9F2", "#C8EDD9", "#FFF3B0", "#FFD6E0", "#E2D4F5", "#FFD8B5", "#A8D8EA", "#D9D9D9"];

type TextField = "charName" | "charLikes" | "charDislikes" | "charLook" | "charPhrase";

export default function BookCardActivity() {
  const { lang, bookCard, setBookCard } = useAppStore();
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [customEmoji, setCustomEmoji] = useState("");

  const imageSource = bookCard.imageSource;

  const field = (key: TextField, phKey: string, opts: { emoji: string; maxLength?: number }) => (
    <div>
      <label htmlFor={`bc-${key}`} className="field-label">
        <span aria-hidden="true">{opts.emoji}</span>
        {t(key, lang)}
      </label>
      <input
        id={`bc-${key}`}
        className="input-cute w-full"
        value={bookCard[key]}
        maxLength={opts.maxLength ?? 60}
        placeholder={t(phKey, lang)}
        onChange={(e) => setBookCard({ [key]: e.target.value })}
      />
    </div>
  );

  const handleCustomEmojiSubmit = () => {
    if (!customEmoji.trim()) return;
    setBookCard({ charEmoji: customEmoji.trim() });
    setCustomEmoji("");
    setEmojiOpen(false);
  };

  const isPreset = COLOR_PRESETS.includes(bookCard.charColor.toUpperCase());

  return (
    <div className="space-y-5">
      <BookContextBar
        idPrefix="bc"
        showCover={bookCard.showBookCover}
        onShowCoverChange={(v) => setBookCard({ showBookCover: v })}
      />

      <div className="grid gap-4">
        {field("charName", "charNamePh", { emoji: "🏷️", maxLength: 30 })}
        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-4">
          {field("charLikes", "charLikesPh", { emoji: "👍" })}
          {field("charDislikes", "charDislikesPh", { emoji: "👎" })}
        </div>
        {field("charLook", "charLookPh", { emoji: "👀" })}
        {field("charPhrase", "charPhrasePh", { emoji: "💬", maxLength: 80 })}

        {/* 색깔 */}
        <div>
          <span className="field-label">
            <span aria-hidden="true">🎨</span>
            {t("charColor", lang)}
          </span>
          <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label={t("charColor", lang)}>
            {COLOR_PRESETS.map((c) => {
              const active = bookCard.charColor.toUpperCase() === c;
              return (
                <button
                  key={c}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  aria-label={c}
                  onClick={() => setBookCard({ charColor: c })}
                  className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-transform ${
                    active ? "border-foreground scale-110" : "border-black/10 hover:scale-105"
                  }`}
                  style={{ backgroundColor: c }}
                >
                  {active && <Icon name="check" size={18} className="text-foreground/80" />}
                </button>
              );
            })}
            <label
              className={`relative h-9 pl-1 pr-3 rounded-full border-2 flex items-center gap-1.5 text-sm font-bold cursor-pointer focus-within:ring-2 focus-within:ring-ring ${
                !isPreset ? "border-foreground" : "border-border"
              }`}
            >
              <span className="w-6 h-6 rounded-full border border-black/10" style={{ backgroundColor: bookCard.charColor }} />
              {t("customColor", lang)}
              <input
                type="color"
                value={bookCard.charColor}
                onChange={(e) => setBookCard({ charColor: e.target.value })}
                className="absolute inset-0 opacity-0 cursor-pointer"
                aria-label={t("customColor", lang)}
              />
            </label>
          </div>
        </div>

        {/* 이모지 */}
        <div>
          <span className="field-label">
            <span aria-hidden="true">😊</span>
            {t("charEmoji", lang)}
            <span className="font-normal text-muted-foreground">({t("optional", lang)})</span>
          </span>
          <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="input-cute w-full flex items-center justify-between text-left"
                aria-label={t("emojiPickerTitle", lang)}
              >
                {bookCard.charEmoji ? (
                  <span className="text-2xl leading-none">{bookCard.charEmoji}</span>
                ) : (
                  <span className="text-muted-foreground/80">{t("emojiPickerTitle", lang)}</span>
                )}
                <Icon name="expand_more" size={20} className="text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[19rem] p-3 rounded-2xl" align="start">
              <p className="text-xs font-bold text-muted-foreground mb-2">{t("emojiPickerTitle", lang)}</p>
              <div className="grid grid-cols-8 gap-0.5 max-h-52 overflow-y-auto mb-3">
                {EMOJI_LIST.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      setBookCard({ charEmoji: emoji });
                      setEmojiOpen(false);
                    }}
                    className={`text-2xl rounded-lg p-1 transition-colors hover:bg-secondary ${
                      bookCard.charEmoji === emoji ? "bg-primary/25" : ""
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <div className="border-t border-border pt-2">
                <p className="text-xs text-muted-foreground mb-1.5">{t("emojiCustom", lang)}</p>
                <div className="flex gap-2">
                  <input
                    className="input-cute flex-1 min-w-0 text-center text-lg h-10"
                    value={customEmoji}
                    onChange={(e) => setCustomEmoji(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCustomEmojiSubmit()}
                    placeholder="✍️"
                    maxLength={8}
                  />
                  <button type="button" onClick={handleCustomEmojiSubmit} className="btn-cute h-10 px-4 text-sm">
                    {t("confirm", lang)}
                  </button>
                </div>
              </div>
              {bookCard.charEmoji && (
                <button
                  type="button"
                  onClick={() => {
                    setBookCard({ charEmoji: "" });
                    setEmojiOpen(false);
                  }}
                  className="w-full mt-2 btn-ghost-cute hover:text-destructive"
                >
                  <Icon name="close" size={16} />
                  {t("removeEmoji", lang)}
                </button>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* 캐릭터 그림: 업로드 / 직접 그리기 */}
      <div className="space-y-3">
        <span className="field-label">
          <span aria-hidden="true">🖼️</span>
          {t("charImage", lang)}
        </span>
        <div className="segmented grid-cols-2">
          <button type="button" aria-pressed={imageSource === "upload"} onClick={() => setBookCard({ imageSource: "upload" })}>
            <Icon name="image" size={18} />
            {t("uploadPhoto", lang)}
          </button>
          <button type="button" aria-pressed={imageSource === "draw"} onClick={() => setBookCard({ imageSource: "draw" })}>
            <Icon name="brush" size={18} />
            {t("drawPicture", lang)}
          </button>
        </div>
        {imageSource === "upload" ? (
          <ImageAttach
            value={bookCard.uploadedImageUrl}
            onChange={(url) => setBookCard({ uploadedImageUrl: url })}
            label={t("uploadDrawing", lang)}
            hint={t("uploadDrawingHint", lang)}
          />
        ) : (
          <DrawingCanvas />
        )}
      </div>
    </div>
  );
}
