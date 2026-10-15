import { useMemo } from "react";
import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";
import type { CardKey } from "@/lib/progress";
import { canShareFiles } from "@/lib/exportCard";
import { useCardExport } from "@/hooks/useCardExport";
import Icon from "./Icon";

/** 미리보기 바로 아래 — 이 카드만 저장/복사/공유 */
export default function CardExportActions({ cardKey }: { cardKey: CardKey }) {
  const lang = useAppStore((s) => s.lang);
  const { busy, save, copy, share } = useCardExport();
  const shareable = useMemo(canShareFiles, []);
  const isBusy = (a: string) => busy === `${cardKey}:${a}`;

  return (
    <div className="flex gap-2">
      <button onClick={() => save(cardKey)} disabled={!!busy} className="btn-cute flex-1">
        <Icon name={isBusy("save") ? "hourglass_top" : "download"} size={20} />
        {isBusy("save") ? t("exporting", lang) : t("exportImage", lang)}
      </button>
      <button onClick={() => copy(cardKey)} disabled={!!busy} className="btn-outline-cute px-4" aria-label={t("copyClipboard", lang)}>
        <Icon name={isBusy("copy") ? "hourglass_top" : "content_copy"} size={20} />
        <span className="hidden min-[400px]:inline">{t("copyClipboard", lang)}</span>
      </button>
      {shareable && (
        <button onClick={() => share(cardKey)} disabled={!!busy} className="btn-outline-cute px-4" aria-label={t("share", lang)}>
          <Icon name={isBusy("share") ? "hourglass_top" : "ios_share"} size={20} />
          <span className="hidden min-[400px]:inline">{t("share", lang)}</span>
        </button>
      )}
    </div>
  );
}
