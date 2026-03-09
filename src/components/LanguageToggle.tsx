import { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/lib/useAppStore";
import { LANG_LABELS, type Lang } from "@/lib/i18n";
import { ChevronDown } from "lucide-react";

const langs: Lang[] = ["ko", "en", "ja", "zh"];

export default function LanguageToggle() {
  const { lang, setLang } = useAppStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full bg-secondary w-9 h-9 justify-center text-xs font-bold hover:bg-secondary/80 transition-colors border border-border"
      >
        {LANG_LABELS[lang]}
        <ChevronDown size={12} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 z-50 bg-card border border-border rounded-xl shadow-lg overflow-hidden min-w-[100px]">
          {langs.map((l) => (
            <button
              key={l}
              onClick={() => { setLang(l); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors hover:bg-secondary ${
                lang === l ? "text-primary bg-primary/10" : "text-foreground"
              }`}
            >
              {LANG_LABELS[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
