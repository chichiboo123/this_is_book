import { useAppStore } from "@/lib/useAppStore";
import { LANG_LABELS, type Lang } from "@/lib/i18n";

const langs: Lang[] = ["ko", "en", "ja", "zh"];

export default function LanguageToggle() {
  const { lang, setLang } = useAppStore();

  return (
    <div className="flex gap-1 rounded-full bg-secondary p-1">
      {langs.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`rounded-full px-3 py-1 text-xs font-bold transition-all duration-200 ${
            lang === l
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {LANG_LABELS[l]}
        </button>
      ))}
    </div>
  );
}
