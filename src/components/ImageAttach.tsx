import { useRef, useState } from "react";
import { toast } from "sonner";
import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";
import { fileToResizedDataUrl } from "@/lib/image";
import Icon from "@/components/Icon";

interface ImageAttachProps {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
  label: string;
  hint?: string;
}

/** 이미지 첨부 영역 — 업로드 시 자동 축소, 바꾸기·지우기 */
export default function ImageAttach({ value, onChange, label, hint }: ImageAttachProps) {
  const lang = useAppStore((s) => s.lang);
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      onChange(await fileToResizedDataUrl(file));
    } catch {
      toast.error(t("imageLoadError", lang));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      {value ? (
        <div className="relative rounded-2xl border border-border bg-secondary/40 p-2">
          <img src={value} alt="" className="w-full max-h-56 object-contain rounded-xl" />
          <div className="absolute top-3 right-3 flex gap-1.5">
            <button
              onClick={() => fileRef.current?.click()}
              className="h-9 px-3 rounded-full bg-card/95 shadow border border-border text-sm font-bold flex items-center gap-1 hover:bg-card"
            >
              <Icon name="cached" size={16} />
              {t("changeImage", lang)}
            </button>
            <button
              onClick={() => onChange(null)}
              aria-label={t("removeImage", lang)}
              className="w-9 h-9 rounded-full bg-card/95 shadow border border-border flex items-center justify-center text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              <Icon name="delete_outline" size={18} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="w-full rounded-2xl border-2 border-dashed border-primary/50 bg-primary/5 hover:bg-primary/10 hover:border-primary transition-colors px-4 py-6 flex flex-col items-center gap-1.5 text-center"
        >
          <span className="w-11 h-11 rounded-full bg-card flex items-center justify-center text-primary-strong shadow-sm">
            <Icon name={busy ? "hourglass_top" : "add_photo_alternate"} size={24} />
          </span>
          <span className="font-bold text-[15px]">{label}</span>
          {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
        </button>
      )}
    </div>
  );
}
