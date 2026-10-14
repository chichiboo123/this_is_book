import { createRef } from "react";
import { getFontEmbedCSS, toPng } from "html-to-image";
import type { CardKey } from "./progress";

/**
 * 내보내기 전용 카드 DOM 참조.
 * ExportStage가 화면 밖에 고정 폭(420px)으로 렌더링하고, 어디서든 이 참조로 캡처한다.
 * (모바일에서 미리보기가 숨겨져 있거나 다른 탭에 있어도 저장 가능)
 */
export const exportStageRef = createRef<HTMLDivElement>();
export const cardRefs: Record<CardKey, React.RefObject<HTMLDivElement>> = {
  bookCard: createRef<HTMLDivElement>(),
  introCard: createRef<HTMLDivElement>(),
  questionCard: createRef<HTMLDivElement>(),
};

const IMAGE_PROXY = import.meta.env.PROD ? "/.netlify/functions/image-proxy" : "/api/image-proxy";

/** 외부 URL 이미지를 프록시를 통해 data URL로 변환 (CORS 회피) */
async function toDataUrl(src: string): Promise<string> {
  const res = await fetch(`${IMAGE_PROXY}?url=${encodeURIComponent(src)}`);
  if (!res.ok) throw new Error(`image proxy ${res.status}`);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

const proxiedCache = new Map<string, string>();
let fontCssPromise: Promise<string> | null = null;

/** 카드 DOM을 PNG data URL로 캡처 */
export async function captureCard(key: CardKey): Promise<string> {
  const node = cardRefs[key].current;
  if (!node) throw new Error("card not mounted");

  // 외부 HTTP(S) 이미지를 data URL로 일시 교체 후 캡처
  const imgs = Array.from(node.querySelectorAll<HTMLImageElement>("img")).filter((img) =>
    /^https?:\/\//.test(img.getAttribute("src") || "")
  );
  const origSrcs = imgs.map((img) => img.getAttribute("src") || "");

  try {
    await Promise.all(
      imgs.map(async (img, i) => {
        try {
          const src = origSrcs[i];
          if (!proxiedCache.has(src)) proxiedCache.set(src, await toDataUrl(src));
          img.setAttribute("src", proxiedCache.get(src)!);
          await img.decode().catch(() => undefined);
        } catch {
          // 프록시 실패 시 원본 유지 (이미지 없이 내보내기)
        }
      })
    );

    // 웹폰트 CSS는 한 번만 만들어 재사용 (여러 장 저장 시 속도 개선)
    if (!fontCssPromise && exportStageRef.current) {
      fontCssPromise = getFontEmbedCSS(exportStageRef.current).catch(() => "");
    }
    const fontEmbedCSS = (await fontCssPromise) || undefined;

    return await toPng(node, { pixelRatio: 2, backgroundColor: "#ffffff", fontEmbedCSS });
  } finally {
    imgs.forEach((img, i) => img.setAttribute("src", origSrcs[i]));
  }
}

function safeFileName(name: string): string {
  return name.replace(/[\\/:*?"<>|\s]+/g, "_").slice(0, 40);
}

export function cardFileName(cardLabel: string, bookTitle: string): string {
  const title = safeFileName(bookTitle);
  return `${safeFileName(cardLabel)}${title ? `_${title}` : ""}.png`;
}

export function downloadDataUrl(dataUrl: string, fileName: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  return (await fetch(dataUrl)).blob();
}

export const canCopyImage = () =>
  typeof navigator !== "undefined" && !!navigator.clipboard?.write && typeof ClipboardItem !== "undefined";

/** 클립보드 복사. Safari는 사용자 제스처 안에서 Promise를 넘겨야 하므로 Promise<Blob> 형태로 전달 */
export async function copyCardToClipboard(key: CardKey) {
  const blobPromise = captureCard(key).then(dataUrlToBlob);
  await navigator.clipboard.write([new ClipboardItem({ "image/png": blobPromise })]);
}

/** Web Share API(모바일)로 파일 공유가 가능한지 */
export function canShareFiles(): boolean {
  if (typeof navigator === "undefined" || !navigator.canShare) return false;
  try {
    const probe = new File([new Blob()], "probe.png", { type: "image/png" });
    return navigator.canShare({ files: [probe] });
  } catch {
    return false;
  }
}

export async function shareCard(key: CardKey, fileName: string, title: string) {
  const blob = await dataUrlToBlob(await captureCard(key));
  const file = new File([blob], fileName, { type: "image/png" });
  await navigator.share({ files: [file], title });
}
