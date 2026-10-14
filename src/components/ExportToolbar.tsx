import { useState } from "react";
import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";
import { CARD_EMOJI, CARD_KEYS, cardStatus, type CardKey } from "@/lib/progress";
import { useCardExport } from "@/hooks/useCardExport";
import Icon from "./Icon";
import { Checkbox } from "@/components/ui/checkbox";

/** 3단계: 여러 카드를 골라 한 번에 저장 */
export default function ExportToolbar() {
  const { lang, bookCard, introText, questions } = useAppStore();
  const status = cardStatus({ bookCard, introText, questions });
  const { busy, saveMany, save, copy } = useCardExport();
  const [picked, setPicked] = useState<CardKey[] | null>(null);

  // 사용자가 직접 고르기 전에는 '완성된 카드'를 기본 선택
  const selected = picked ?? CARD_KEYS.filter((k) => status[k]);
  const toggle = (k: CardKey) =>
    setPicked(selected.includes(k) ? selected.filter((x) => x !== k) : CARD_KEYS.filter((x) => x === k || selected.includes(x)));
  const allSelected = selected.length === CARD_KEYS.length;

  return (
    <section id="step-share" className="card-activity space-y-4 scroll-mt-20">
      <div className="space-y-1">
        <h2 className="flex items-center gap-2.5 section-title">
          <span className="step-badge">3</span>
          {t("stepShare", lang)}
        </h2>
        <p className="text-sm text-muted-foreground">{t("exportDesc", lang)}</p>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
          <Checkbox
            checked={allSelected}
            onCheckedChange={(v) => setPicked(v ? [...CARD_KEYS] : [])}
          />
          {t("selectAll", lang)}
        </label>
      </div>

      <ul className="grid gap-2 sm:grid-cols-3">
        {CARD_KEYS.map((key) => {
          const checked = selected.includes(key);
          return (
            <li
              key={key}
              className={`rounded-2xl border-2 p-3 transition-colors ${checked ? "border-primary bg-primary/10" : "border-border bg-card"}`}
            >
              <label className="flex items-center gap-2.5 cursor-pointer">
                <Checkbox checked={checked} onCheckedChange={() => toggle(key)} />
                <span className="text-xl" aria-hidden="true">{CARD_EMOJI[key]}</span>
                <span className="flex-1 min-w-0">
                  <span className="block font-bold text-[15px]">{t(key, lang)}</span>
                  <span className={`text-xs font-bold ${status[key] ? "text-primary-strong" : "text-muted-foreground"}`}>
                    {status[key] ? `✓ ${t("complete", lang)}` : t("notStarted", lang)}
                  </span>
                </span>
              </label>
              <div className="flex gap-1.5 mt-2.5 pl-7">
                <button onClick={() => save(key)} disabled={!!busy} className="btn-ghost-cute h-8 px-2.5 bg-secondary/70 text-foreground" aria-label={`${t(key, lang)} ${t("exportImage", lang)}`}>
                  <Icon name="download" size={16} />
                  <span className="text-xs">{t("exportImage", lang)}</span>
                </button>
                <button onClick={() => copy(key)} disabled={!!busy} className="btn-ghost-cute h-8 px-2.5 bg-secondary/70 text-foreground" aria-label={`${t(key, lang)} ${t("copyClipboard", lang)}`}>
                  <Icon name="content_copy" size={16} />
                  <span className="text-xs">{t("copyClipboard", lang)}</span>
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <button onClick={() => saveMany(selected)} disabled={!!busy || selected.length === 0} className="btn-cute w-full h-12 text-base">
        <Icon name={busy === "many" ? "hourglass_top" : "download"} size={22} />
        {busy === "many" ? t("exporting", lang) : t("saveSelected", lang, { n: selected.length })}
      </button>
    </section>
  );
}
