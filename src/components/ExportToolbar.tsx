import { useState } from "react";
import { toPng } from "html-to-image";
import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";
import { toast } from "sonner";
import { Download, Copy, CheckSquare } from "lucide-react";

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
    <div className="card-activity space-y-4 border-2 border-primary/20">
      <h3 className="section-title text-lg mb-2 flex items-center gap-2">
        <Download size={20} />
        {t("exportSelected", lang)}
      </h3>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map(([key, label, ref]) => (
          <div key={key} className="flex flex-col gap-3 p-4 rounded-xl bg-card border-2 border-primary/10 shadow-sm transition-all hover:border-primary/30">
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm font-bold group-hover:text-primary transition-colors">{label}</span>
              <input
                type="checkbox"
                checked={selected.has(key)}
                onChange={() => toggle(key)}
                className="w-5 h-5 accent-[hsl(var(--primary))] cursor-pointer rounded"
                title={t("selectCards", lang)}
              />
            </label>
            <div className="flex gap-2 mt-auto">
              <button
                onClick={() => handleExportImage(key, ref)}
                className="btn-cute flex-1 text-xs py-2 px-2 flex items-center justify-center gap-1"
              >
                <Download size={14} /> {t("exportImage", lang)}
              </button>
              <button
                onClick={() => handleCopyClipboard(ref)}
                className="btn-outline-cute flex-1 text-xs py-2 px-2 flex items-center justify-center gap-1"
              >
                <Copy size={14} /> {t("copyClipboard", lang)}
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleExportSelected}
        disabled={selected.size === 0}
        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
          selected.size > 0 
            ? "bg-primary text-primary-foreground shadow-md hover:scale-[1.02]" 
            : "bg-secondary text-muted-foreground opacity-50 cursor-not-allowed"
        }`}
      >
        <CheckSquare size={18} />
        {t("exportSelected", lang)} {selected.size > 0 ? `(${selected.size})` : ""}
      </button>
    </div>
  );
}
