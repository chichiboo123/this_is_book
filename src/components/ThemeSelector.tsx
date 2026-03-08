import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";

const themes = [
  { id: "blue" as const, emoji: "💙" },
  { id: "green" as const, emoji: "💚" },
  { id: "yellow" as const, emoji: "💛" },
  { id: "pink" as const, emoji: "💗" },
];

export default function ThemeSelector() {
  const { theme, setTheme, lang } = useAppStore();

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-muted-foreground">{t("theme", lang)}</span>
      <div className="flex gap-1 rounded-full bg-secondary p-1">
        {themes.map((th) => (
          <button
            key={th.id}
            onClick={() => setTheme(th.id)}
            className={`rounded-full w-8 h-8 flex items-center justify-center text-base transition-all duration-200 ${
              theme === th.id
                ? "scale-125 shadow-md"
                : "opacity-60 hover:opacity-100 hover:scale-110"
            }`}
          >
            {th.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
