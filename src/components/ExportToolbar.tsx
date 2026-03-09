import { toPng } from "html-to-image";
import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";
import { toast } from "sonner";
import { Download, Copy } from "lucide-react";

interface ExportToolbarProps {
  cardRefs: {
    bookCard: React.RefObject<HTMLDivElement>;
    introCard: React.RefObject<HTMLDivElement>;
    questionCard: React.RefObject<HTMLDivElement>;
  };
}

export default function ExportToolbar({ cardRefs }: ExportToolbarProps) {
  const { lang } = useAppStore();

  const captureCard = async (ref: React.RefObject<HTMLDivElement>) => {
    if (!ref.current) return null;
    return toPng(ref.current, { pixelRatio: 2, backgroundColor: "#ffffff" });
  };

  const downloadDataUrl = (dataUrl: string, name: string) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${name}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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

  const cards: [string, string, React.RefObject<HTMLDivElement>][] = [
    ["bookCard", t("bookCard", lang), cardRefs.bookCard],
    ["introCard", t("introCard", lang), cardRefs.introCard],
    ["questionCard", t("questionCard", lang), cardRefs.questionCard],
  ];

  return (
    <div className="card-activity space-y-4 border-2 border-primary/20">
      <h3 className="section-title text-lg mb-2 flex items-center gap-2">
        <Download size={20} />
        {t("exportSection", lang)}
      </h3>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map(([key, label, ref]) => (
          <div key={key} className="flex flex-col gap-3 p-4 rounded-xl bg-card border-2 border-primary/10 shadow-sm">
            <span className="text-sm font-bold text-center">{label}</span>
            <div className="flex gap-2">
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
    </div>
  );
}
