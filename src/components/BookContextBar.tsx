import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";
import Icon from "@/components/Icon";
import { Switch } from "@/components/ui/switch";
import { focusBookSearch } from "@/lib/nav";

interface BookContextBarProps {
  /** 이 카드에 책 표지를 넣을지 */
  showCover: boolean;
  onShowCoverChange: (v: boolean) => void;
  idPrefix: string;
}

/** 각 카드 작성 영역 상단: 카드에 표시될 책 제목(수정 가능) + 표지 포함 스위치 */
export default function BookContextBar({ showCover, onShowCoverChange, idPrefix }: BookContextBarProps) {
  const { lang, selectedBook, customTitle, setCustomTitle } = useAppStore();

  if (!selectedBook) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-2xl border border-dashed border-primary/50 bg-primary/5 px-4 py-3">
        <span className="text-sm text-muted-foreground flex items-center gap-1.5">
          <Icon name="menu_book" size={18} />
          {t("noBookYet", lang)}
        </span>
        <button onClick={focusBookSearch} className="btn-ghost-cute -mr-2 text-primary-strong whitespace-nowrap">
          {t("goPickBook", lang)}
          <Icon name="arrow_upward" size={16} />
        </button>
      </div>
    );
  }

  const cover = selectedBook.imageLinks?.thumbnail;
  const titleId = `${idPrefix}-book-title`;
  const coverId = `${idPrefix}-cover`;

  return (
    <div className="rounded-2xl bg-secondary/50 p-3 space-y-2.5">
      <div>
        <label htmlFor={titleId} className="text-xs font-bold text-muted-foreground flex items-center gap-1 mb-1">
          <Icon name="edit" size={14} />
          {t("cardTitleHint", lang)}
        </label>
        <input
          id={titleId}
          className="w-full bg-card rounded-xl px-3 h-10 text-base font-bold border border-border focus:border-primary focus:ring-4 focus:ring-primary/25 focus:outline-none"
          value={customTitle}
          onChange={(e) => setCustomTitle(e.target.value)}
        />
      </div>
      {cover && (
        <div className="flex items-center gap-3">
          <Switch id={coverId} checked={showCover} onCheckedChange={onShowCoverChange} />
          <label htmlFor={coverId} className="text-sm font-bold text-foreground/80 cursor-pointer select-none flex-1">
            {t("includeCover", lang)}
          </label>
          <img
            src={cover}
            alt=""
            className={`w-7 h-10 object-cover rounded shadow-sm transition-opacity ${showCover ? "opacity-100" : "opacity-40"}`}
          />
        </div>
      )}
    </div>
  );
}
