import { useRef } from "react";
import { createPortal } from "react-dom";
import { toPng } from "html-to-image";
import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";
import { toast } from "sonner";
import { Download, Copy } from "lucide-react";
import BookCardPreview from "@/components/BookCardPreview";
import IntroCardPreview from "@/components/IntroCardPreview";
import QuestionCardPreview from "@/components/QuestionCardPreview";

export default function ExportToolbar() {
  const { lang } = useAppStore();

  const bookCardRef = useRef<HTMLDivElement>(null);
  const introCardRef = useRef<HTMLDivElement>(null);
  const questionCardRef = useRef<HTMLDivElement>(null);

  // 환경별 이미지 프록시 엔드포인트
  const IMAGE_PROXY = import.meta.env.PROD
    ? "/.netlify/functions/image-proxy"
    : "/api/image-proxy";

  /** 외부 URL 이미지를 프록시를 통해 data URL로 변환 */
  const toDataUrl = async (src: string): Promise<string> => {
    const res = await fetch(`${IMAGE_PROXY}?url=${encodeURIComponent(src)}`);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const captureCard = async (ref: React.RefObject<HTMLDivElement>) => {
    if (!ref.current) return null;

    // CORS 차단 방지: 외부 HTTP(S) URL img를 data URL로 일시 교체 후 캡처
    const imgs = Array.from(
      ref.current.querySelectorAll<HTMLImageElement>("img")
    ).filter((img) => /^https?:\/\//.test(img.getAttribute("src") || ""));

    const origSrcs = imgs.map((img) => img.getAttribute("src") || "");

    await Promise.all(
      imgs.map(async (img, i) => {
        try {
          const dataUrl = await toDataUrl(origSrcs[i]);
          img.setAttribute("src", dataUrl);
        } catch {
          // 프록시 실패 시 원본 유지 (이미지 없이 내보내기)
        }
      })
    );

    const result = await toPng(ref.current, { pixelRatio: 2, backgroundColor: "#ffffff" });

    // 원본 src 복원
    imgs.forEach((img, i) => img.setAttribute("src", origSrcs[i]));

    return result;
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
    ["bookCard", t("bookCard", lang), bookCardRef],
    ["introCard", t("introCard", lang), introCardRef],
    ["questionCard", t("questionCard", lang), questionCardRef],
  ];

  return (
    <>
      <div className="card-activity space-y-4 border-2 border-primary/20">
        <h3 className="section-title text-lg mb-2 flex items-center gap-2">
          <Download size={20} />
          {t("exportSection", lang)}
        </h3>

        <div className="flex flex-col gap-2">
          {cards.map(([key, label, ref]) => (
            <div key={key} className="flex items-center justify-between px-4 py-3 rounded-xl bg-card border-2 border-primary/10 shadow-sm">
              <span className="text-sm font-bold">{label}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleExportImage(key, ref)}
                  title={t("exportImage", lang)}
                  className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                >
                  <Download size={16} className="text-primary" />
                </button>
                <button
                  onClick={() => handleCopyClipboard(ref)}
                  title={t("copyClipboard", lang)}
                  className="w-9 h-9 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors border border-border"
                >
                  <Copy size={16} className="text-muted-foreground" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 내보내기 전용 숨김 렌더링 — document.body 포털로 항상 마운트, 투명도 없이 화면 밖 고정 */}
      {createPortal(
        <div
          aria-hidden="true"
          style={{ position: "fixed", top: "-9999px", left: 0, width: "420px", pointerEvents: "none" }}
        >
          <div ref={bookCardRef}><BookCardPreview /></div>
          <div ref={introCardRef}><IntroCardPreview /></div>
          <div ref={questionCardRef}><QuestionCardPreview /></div>
        </div>,
        document.body
      )}
    </>
  );
}
