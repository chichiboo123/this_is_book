import { useRef } from "react";
import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";
import BookContextBar from "./BookContextBar";
import ImageAttach from "./ImageAttach";
import StarRating from "./StarRating";

const INTRO_MAX = 400;
const IDEA_KEYS = ["introIdea1", "introIdea2", "introIdea3", "introIdea4"];

export default function IntroCardActivity() {
  const {
    lang, introText, setIntroText, introImageUrl, setIntroImageUrl,
    introRating, setIntroRating, showIntroBookCover, setShowIntroBookCover,
  } = useAppStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /** 글머리 아이디어를 이어 붙이고 커서를 끝으로 */
  const appendIdea = (key: string) => {
    const idea = t(key, lang);
    const next = (introText.trim() ? `${introText.trimEnd()}\n` : "") + idea;
    setIntroText(next.slice(0, INTRO_MAX));
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    });
  };

  return (
    <div className="space-y-5">
      <BookContextBar idPrefix="ic" showCover={showIntroBookCover} onShowCoverChange={setShowIntroBookCover} />

      <div>
        <span className="field-label">
          <span aria-hidden="true">⭐</span>
          {t("rating", lang)}
        </span>
        <StarRating value={introRating} onChange={setIntroRating} />
      </div>

      <div>
        <label htmlFor="intro-text" className="field-label">
          <span aria-hidden="true">📣</span>
          {t("introText", lang)}
        </label>
        <textarea
          id="intro-text"
          ref={textareaRef}
          className="textarea-cute w-full min-h-[168px]"
          placeholder={t("introPlaceholder", lang)}
          value={introText}
          maxLength={INTRO_MAX}
          onChange={(e) => setIntroText(e.target.value)}
        />
        <p className="text-right text-xs text-muted-foreground mt-1" aria-live="polite">
          {t("charCount", lang, { n: introText.length })} / {INTRO_MAX}
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-bold text-muted-foreground">💡 {t("introIdeas", lang)}</p>
        <div className="flex flex-wrap gap-2">
          {IDEA_KEYS.map((key) => (
            <button key={key} type="button" onClick={() => appendIdea(key)} className="chip">
              {t(key, lang).trim()}…
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="field-label">
          <span aria-hidden="true">🖼️</span>
          {t("uploadImage", lang)}
          <span className="font-normal text-muted-foreground">({t("optional", lang)})</span>
        </span>
        <ImageAttach value={introImageUrl} onChange={setIntroImageUrl} label={t("uploadImage", lang)} />
      </div>
    </div>
  );
}
