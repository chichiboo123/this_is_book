import { useRef, useState, useEffect } from "react";
import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";
import Icon from "@/components/Icon";

const CANVAS_SIZE = 600; // 내부 해상도 (화면 표시 크기와 무관, 내보내기 선명도 확보)
const MAX_HISTORY = 20;
const COLORS = ["#333333", "#E74C3C", "#FF9800", "#F1C40F", "#2ECC71", "#3498DB", "#9B59B6", "#E91E63", "#8D6E63", "#FFFFFF"];

export default function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lang = useAppStore((s) => s.lang);
  const drawingDataUrl = useAppStore((s) => s.bookCard.drawingDataUrl);
  const setBookCard = useAppStore((s) => s.setBookCard);

  const [penColor, setPenColor] = useState("#333333");
  const [penSize, setPenSize] = useState(4);
  const [isEraser, setIsEraser] = useState(false);
  const [historyLen, setHistoryLen] = useState(0);

  const drawingRef = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const history = useRef<ImageData[]>([]);
  const lastSavedUrl = useRef<string | null>(null);

  const getCtx = () => canvasRef.current?.getContext("2d", { willReadFrequently: true }) ?? null;

  // 저장된 그림 복원 (새로고침·작업 파일 불러오기·초기화 대응)
  useEffect(() => {
    if (drawingDataUrl === lastSavedUrl.current) return;
    const ctx = getCtx();
    if (!ctx) return;
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    history.current = [];
    setHistoryLen(0);
    lastSavedUrl.current = drawingDataUrl;
    if (drawingDataUrl) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
      img.src = drawingDataUrl;
    }
  }, [drawingDataUrl]);

  const save = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const isBlank = !getCtx()
      ?.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE)
      .data.some((v, i) => i % 4 === 3 && v !== 0);
    const url = isBlank ? null : canvas.toDataURL("image/png");
    lastSavedUrl.current = url;
    setBookCard({ drawingDataUrl: url });
  };

  const pushHistory = () => {
    const ctx = getCtx();
    if (!ctx) return;
    history.current.push(ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE));
    if (history.current.length > MAX_HISTORY) history.current.shift();
    setHistoryLen(history.current.length);
  };

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * CANVAS_SIZE,
      y: ((e.clientY - rect.top) / rect.height) * CANVAS_SIZE,
    };
  };

  const applyStyle = (ctx: CanvasRenderingContext2D, pressure: number) => {
    const scale = CANVAS_SIZE / 300;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (isEraser) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = penSize * 3 * scale;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = penColor;
      ctx.fillStyle = penColor;
      // 펜(스타일러스) 필압 반영, 마우스·손가락은 0.5 고정값
      ctx.lineWidth = penSize * scale * (0.6 + (pressure || 0.5) * 0.8);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = getCtx();
    if (!ctx) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pushHistory();
    drawingRef.current = true;
    const pos = getPos(e);
    lastPoint.current = pos;
    applyStyle(ctx, e.pressure);
    // 점 하나만 찍어도 보이도록
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, ctx.lineWidth / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const ctx = getCtx();
    const prev = lastPoint.current;
    if (!ctx || !prev) return;
    const pos = getPos(e);
    applyStyle(ctx, e.pressure);
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPoint.current = pos;
  };

  const handlePointerUp = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    lastPoint.current = null;
    save();
  };

  const undo = () => {
    const ctx = getCtx();
    const snapshot = history.current.pop();
    if (!ctx || !snapshot) return;
    ctx.putImageData(snapshot, 0, 0);
    setHistoryLen(history.current.length);
    save();
  };

  const clearCanvas = () => {
    const ctx = getCtx();
    if (!ctx) return;
    pushHistory();
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    save();
  };

  return (
    <div className="space-y-3">
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        aria-label={t("drawHere", lang)}
        className={`w-full max-w-sm mx-auto block aspect-square rounded-2xl border-2 border-dashed border-primary/50 bg-white touch-none ${
          isEraser ? "cursor-cell" : "cursor-crosshair"
        }`}
        style={{
          backgroundImage: "radial-gradient(hsl(var(--primary) / 0.25) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />

      {/* 도구 */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="segmented grid-cols-2 flex-1 min-w-[10rem]">
          <button type="button" aria-pressed={!isEraser} onClick={() => setIsEraser(false)}>
            <Icon name="edit" size={18} />
            {t("pen", lang)}
          </button>
          <button type="button" aria-pressed={isEraser} onClick={() => setIsEraser(true)}>
            <Icon name="auto_fix_normal" size={18} />
            {t("eraser", lang)}
          </button>
        </div>
        <button type="button" onClick={undo} disabled={historyLen === 0} className="icon-btn disabled:opacity-40" aria-label={t("undo", lang)} title={t("undo", lang)}>
          <Icon name="undo" size={20} />
        </button>
        <button type="button" onClick={clearCanvas} className="icon-btn hover:text-destructive" aria-label={t("clearCanvas", lang)} title={t("clearCanvas", lang)}>
          <Icon name="delete_sweep" size={20} />
        </button>
      </div>

      {!isEraser && (
        <div className="flex items-center gap-1.5 flex-wrap" role="radiogroup" aria-label={t("penColor", lang)}>
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={penColor === c}
              aria-label={c}
              onClick={() => setPenColor(c)}
              className={`w-8 h-8 rounded-full border-2 transition-transform ${
                penColor === c ? "scale-110 border-foreground ring-2 ring-card" : "border-black/10"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      )}

      <label className="flex items-center gap-3">
        <span className="text-sm font-bold text-foreground/80 shrink-0">{t("penSize", lang)}</span>
        <input
          type="range"
          min={1}
          max={12}
          value={penSize}
          onChange={(e) => setPenSize(Number(e.target.value))}
          className="flex-1 accent-[hsl(var(--primary-strong))]"
        />
        <span
          className="rounded-full bg-foreground shrink-0"
          style={{ width: Math.max(4, penSize * 2), height: Math.max(4, penSize * 2), backgroundColor: isEraser ? undefined : penColor }}
          aria-hidden="true"
        />
      </label>
    </div>
  );
}
