import { useRef, useState, useEffect, useCallback } from "react";
import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Eraser, Pen } from "lucide-react";

export default function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { lang, setBookCard } = useAppStore();
  const [drawing, setDrawing] = useState(false);
  const [penColor, setPenColor] = useState("#333333");
  const [penSize, setPenSize] = useState(3);
  const [isEraser, setIsEraser] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const getCtx = () => canvasRef.current?.getContext("2d");

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      const touch = e.touches[0];
      return { x: (touch.clientX - rect.left) * scaleX, y: (touch.clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const ctx = getCtx();
    if (!ctx) return;
    setDrawing(true);
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing) return;
    e.preventDefault();
    const ctx = getCtx();
    if (!ctx) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    
    if (isEraser) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = penSize * 3;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = penColor;
      ctx.lineWidth = penSize;
    }
    
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  };

  const endDraw = useCallback(() => {
    if (!drawing) return;
    setDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setBookCard({ drawingDataUrl: canvas.toDataURL("image/png") });
    }
  }, [drawing, setBookCard]);

  useEffect(() => {
    window.addEventListener("mouseup", endDraw);
    window.addEventListener("touchend", endDraw);
    return () => {
      window.removeEventListener("mouseup", endDraw);
      window.removeEventListener("touchend", endDraw);
    };
  }, [endDraw]);

  const clearCanvas = () => {
    const ctx = getCtx();
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setBookCard({ drawingDataUrl: null });
  };

  const colors = ["#333333", "#E74C3C", "#3498DB", "#2ECC71", "#F39C12", "#9B59B6", "#E91E63", "#FF9800"];

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2 border-2 border-primary/20 rounded-xl p-3 bg-card/50">
      <CollapsibleTrigger className="flex items-center justify-between w-full font-bold text-sm text-muted-foreground hover:text-foreground transition-colors">
        <span>🎨 {t("drawHere", lang)}</span>
        <ChevronDown className={`transition-transform ${isOpen ? "rotate-180" : ""}`} size={16} />
      </CollapsibleTrigger>
      
      <CollapsibleContent className="space-y-3 pt-2">
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="w-full aspect-square rounded-xl border-2 border-dashed border-primary/30 bg-card cursor-crosshair touch-none"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onTouchStart={startDraw}
          onTouchMove={draw}
        />
        
        <div className="flex gap-2">
          <button
            onClick={() => setIsEraser(false)}
            className={`flex-1 flex justify-center items-center gap-1 py-1.5 rounded-lg border-2 transition-colors ${!isEraser ? "border-primary bg-primary/10 text-primary font-bold" : "border-transparent bg-secondary"}`}
          >
            <Pen size={16} /> <span className="text-xs">{t("pen", lang)}</span>
          </button>
          <button
            onClick={() => setIsEraser(true)}
            className={`flex-1 flex justify-center items-center gap-1 py-1.5 rounded-lg border-2 transition-colors ${isEraser ? "border-primary bg-primary/10 text-primary font-bold" : "border-transparent bg-secondary"}`}
          >
            <Eraser size={16} /> <span className="text-xs">{t("eraser", lang)}</span>
          </button>
        </div>

        {!isEraser && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">{t("penColor", lang)}:</span>
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setPenColor(c)}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  penColor === c ? "scale-125 border-foreground" : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{t("penSize", lang)}:</span>
          <input
            type="range"
            min={1}
            max={10}
            value={penSize}
            onChange={(e) => setPenSize(Number(e.target.value))}
            className="flex-1 accent-[hsl(var(--primary))]"
          />
          <span className="text-xs w-4">{penSize}</span>
        </div>
        
        <button onClick={clearCanvas} className="btn-outline-cute text-xs w-full">
          🗑️ {t("clearCanvas", lang)}
        </button>
      </CollapsibleContent>
    </Collapsible>
  );
}
