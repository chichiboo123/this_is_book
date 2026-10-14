import { useState } from "react";
import { toast } from "sonner";
import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";
import type { CardKey } from "@/lib/progress";
import {
  captureCard,
  cardFileName,
  copyCardToClipboard,
  downloadDataUrl,
  shareCard,
  canCopyImage,
} from "@/lib/exportCard";

type Action = "save" | "copy" | "share";

/** 카드 이미지 저장·복사·공유 + 진행 상태/오류 안내 */
export function useCardExport() {
  const [busy, setBusy] = useState<string | null>(null);

  const fileNameFor = (key: CardKey) => {
    const { lang, customTitle, selectedBook } = useAppStore.getState();
    return cardFileName(t(key, lang), customTitle || selectedBook?.title || "");
  };

  const run = async (key: CardKey, action: Action, fn: () => Promise<void>) => {
    if (busy) return;
    const lang = useAppStore.getState().lang;
    setBusy(`${key}:${action}`);
    try {
      await fn();
    } catch (err) {
      // 사용자가 공유 시트를 닫은 경우는 오류 아님
      if (err instanceof DOMException && err.name === "AbortError") return;
      console.error(err);
      toast.error(t("exportFailed", lang));
    } finally {
      setBusy(null);
    }
  };

  const save = (key: CardKey) =>
    run(key, "save", async () => {
      downloadDataUrl(await captureCard(key), fileNameFor(key));
      toast.success(t("saved", useAppStore.getState().lang));
    });

  const saveMany = async (keys: CardKey[]) => {
    if (busy || keys.length === 0) return;
    const lang = useAppStore.getState().lang;
    setBusy("many");
    try {
      for (const key of keys) {
        downloadDataUrl(await captureCard(key), fileNameFor(key));
        // 브라우저가 연속 다운로드를 막지 않도록 약간 간격
        await new Promise((r) => setTimeout(r, 300));
      }
      toast.success(t("saved", lang));
    } catch (err) {
      console.error(err);
      toast.error(t("exportFailed", lang));
    } finally {
      setBusy(null);
    }
  };

  const copy = (key: CardKey) =>
    run(key, "copy", async () => {
      const lang = useAppStore.getState().lang;
      if (!canCopyImage()) {
        toast.info(t("copyUnsupported", lang));
        return;
      }
      await copyCardToClipboard(key);
      toast.success(t("copied", lang));
    });

  const share = (key: CardKey) =>
    run(key, "share", async () => {
      const { lang, customTitle, selectedBook } = useAppStore.getState();
      await shareCard(key, fileNameFor(key), `${t(key, lang)} · ${customTitle || selectedBook?.title || ""}`);
    });

  return { busy, save, saveMany, copy, share };
}
