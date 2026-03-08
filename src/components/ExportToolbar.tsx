import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";
import { toast } from "sonner";

interface ExportToolbarProps {
  cardRefs: {
    bookCard: React.RefObject<HTMLDivElement>;
    introCard: React.RefObject<HTMLDivElement>;
    questionCard: React.RefObject<HTMLDivElement>;
  };
}

export default function ExportToolbar({ cardRefs }: ExportToolbarProps) {
  const { lang } = useAppStore();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const captureCard = async (ref: React.RefObject<HTMLDivElement>) => {
    if (!ref.current) return null;
    return toPng(ref.current, { pixelRatio: 2, backgroundColor: "#ffffff" });
  };

  const downloadDataUrl = (dataUrl: string, name: string) => {
    // Convert PNG data URL to webp by drawing to canvas
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const webpUrl = canvas.toDataURL("image/webp", 0.9);
      const a = document.createElement("a");
      a.href = webpUrl;
      a.download = `${name}.webp`;
      a.click();
    };
    img.src = dataUrl;
  };

  const handleExportImage = async (key: string, ref: React.RefObject<HTMLDivElement>) => {
    const dataUrl = await captureCard(ref);
    if (dataUrl) {
      downloadDataUrl(dataUrl, key);
      toast.success(t("saved", lang));
    }
  };

  const handleCopyClipboard = async (ref: React.RefObject<HTMLDivElement>) => {
    const dataUrl = await captureCard(ref);
    if (!dataUrl) return;
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    toast.success(t("copied", lang));
  };

  const handleExportSelected = async () => {
    const entries: [string, React.RefObject<HTMLDivElement>][] = [
      ["bookCard", cardRefs.bookCard],
      ["introCard", cardRefs.introCard],
      ["questionCard", cardRefs.questionCard],
    ];
    for (const [key, ref] of entries) {
      if (selected.has(key)) {
        const dataUrl = await captureCard(ref);
        if (dataUrl) downloadDataUrl(dataUrl, key);
      }
    }
    if (selected.size > 0) toast.success(t("saved", lang));
  };

  const cards: [string, string, React.RefObject<HTMLDivElement>][] = [
    ["bookCard", t("bookCard", lang), cardRefs.bookCard],
    ["introCard", t("introCard", lang), cardRefs.introCard],
    ["questionCard", t("questionCard", lang), cardRefs.questionCard],
  ];

  return (
    <div className="card-activity space-y-4">
      <h3 className="section-title text-lg">📤 {t("exportSelected", lang)}</h3>

      {/* Individual export buttons */}
      <div className="grid gap-3">
        {cards.map(([key, label, ref]) => (
          <div key={key} className="flex items-center gap-2 flex-wrap">
            <input
              type="checkbox"
              checked={selected.has(key)}
              onChange={() => toggle(key)}
              className="w-4 h-4 accent-[hsl(var(--primary))]"
            />
            <span className="text-sm font-bold flex-1">{label}</span>
            <button
              onClick={() => handleExportImage(key, ref)}
              className="btn-cute text-xs py-1.5 px-3"
            >
              {t("exportImage", lang)}
            </button>
            <button
              onClick={() => handleCopyClipboard(ref)}
              className="btn-outline-cute text-xs py-1.5 px-3"
            >
              {t("copyClipboard", lang)}
            </button>
          </div>
        ))}
      </div>

      {selected.size > 0 && (
        <button onClick={handleExportSelected} className="btn-cute w-full">
          {t("exportSelected", lang)} ({selected.size})
        </button>
      )}
    </div>
  );
}
