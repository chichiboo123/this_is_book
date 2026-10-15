import { useState } from "react";
import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";
import type { CardKey } from "@/lib/progress";
import CardExportActions from "./CardExportActions";
import Icon from "./Icon";

interface CardWorkspaceProps {
  cardKey: CardKey;
  activity: React.ReactNode;
  preview: React.ReactNode;
  /** 다음 단계 버튼 */
  next: { label: string; onClick: () => void };
}

/**
 * 카드 작성(왼쪽) + 실시간 미리보기(오른쪽, 고정).
 * 모바일에서는 '작성하기 / 미리보기' 전환으로 스크롤 없이 바로 확인.
 */
export default function CardWorkspace({ cardKey, activity, preview, next }: CardWorkspaceProps) {
  const lang = useAppStore((s) => s.lang);
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");

  const switchView = (v: "edit" | "preview") => {
    setMobileView(v);
    document.getElementById("step-make")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="space-y-4">
      <div className="segmented grid-cols-2 md:hidden sticky top-[60px] z-30 shadow-sm border border-border">
        <button type="button" aria-pressed={mobileView === "edit"} onClick={() => switchView("edit")}>
          <Icon name="edit_note" size={20} />
          {t("editTab", lang)}
        </button>
        <button type="button" aria-pressed={mobileView === "preview"} onClick={() => switchView("preview")}>
          <Icon name="visibility" size={20} />
          {t("previewTab", lang)}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,420px)] gap-5 lg:gap-6 items-start">
        <div className={`card-activity ${mobileView === "edit" ? "" : "hidden md:block"}`}>
          {activity}
          <div className="mt-6 pt-5 border-t border-border flex justify-end">
            <button onClick={next.onClick} className="btn-outline-cute">
              {next.label}
              <Icon name="arrow_forward" size={20} />
            </button>
          </div>
        </div>

        <div className={`md:sticky md:top-24 md:max-h-[calc(100vh-7rem)] md:overflow-y-auto md:pb-2 md:-mx-2 md:px-2 space-y-3 ${mobileView === "preview" ? "" : "hidden md:block"}`}>
          <p className="hidden md:flex items-center gap-1.5 text-sm font-bold text-muted-foreground">
            <Icon name="visibility" size={18} />
            {t("previewTab", lang)}
          </p>
          <div className="animate-in fade-in duration-300">{preview}</div>
          <CardExportActions cardKey={cardKey} />
        </div>
      </div>
    </div>
  );
}
