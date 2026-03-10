import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { useAppStore } from "@/lib/useAppStore";

export default function ResetButton() {
  const [open, setOpen] = useState(false);
  const { reset } = useAppStore();

  const handleReset = () => {
    reset();
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center w-9 h-9 rounded-full bg-secondary hover:bg-secondary/80 transition-colors border border-border"
        title="초기화"
      >
        <RotateCcw size={15} className="text-muted-foreground" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-end justify-center p-4 pb-16"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-card rounded-2xl shadow-2xl w-full max-w-sm border border-border p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center space-y-2">
              <p className="text-3xl">⚠️</p>
              <h2 className="text-lg font-bold">모든 내용 초기화</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                지금까지 입력한 모든 내용이 삭제됩니다.<br />
                이 작업은 되돌릴 수 없습니다.
              </p>
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-sm font-bold transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground text-sm font-bold transition-colors"
              >
                초기화
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
