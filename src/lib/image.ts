/**
 * 업로드한 이미지를 최대 변 길이(maxSize)로 줄여 data URL로 변환.
 * 휴대폰 사진(수 MB)을 그대로 저장하면 localStorage 용량(약 5MB)을 넘어
 * 자동 저장이 실패하므로, 카드에 충분한 해상도로만 줄여서 보관한다.
 */
export async function fileToResizedDataUrl(file: File, maxSize = 1024, quality = 0.85): Promise<string> {
  const original = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  // GIF·SVG는 변환하지 않음 (애니메이션/벡터 보존)
  if (/image\/(gif|svg)/.test(file.type)) return original;

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = original;
  });

  const scale = Math.min(1, maxSize / Math.max(img.naturalWidth, img.naturalHeight));
  if (scale === 1 && file.size < 400_000) return original;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return original;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // 투명 배경이 있을 수 있는 PNG는 PNG로, 나머지는 JPEG로
  return file.type === "image/png"
    ? canvas.toDataURL("image/png")
    : canvas.toDataURL("image/jpeg", quality);
}

/** 배경색 위에 올릴 글자색(검정/흰색)을 명도 대비로 결정 */
export function readableTextColor(hex: string): string {
  const m = hex.replace("#", "").match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return "#1a1a1a";
  const [r, g, b] = m.slice(1).map((h) => {
    const c = parseInt(h, 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.4 ? "#1a1a1a" : "#ffffff";
}
