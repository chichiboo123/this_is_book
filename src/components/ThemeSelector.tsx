import { useState, useRef } from "react";
import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";
import { Download, Upload } from "lucide-react";

const themes = [
  { id: "blue" as const, emoji: "💙" },
  { id: "green" as const, emoji: "💚" },
  { id: "yellow" as const, emoji: "💛" },
  { id: "pink" as const, emoji: "💗" },
];

export default function ThemeSelector() {
  const { theme, setTheme, lang } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const exportData = () => {
    const state = useAppStore.getState();
    const data = JSON.stringify({
      lang: state.lang,
      theme: state.theme,
      selectedBook: state.selectedBook,
      bookCard: state.bookCard,
      introText: state.introText,
      questions: state.questions,
    });
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "this-is-book-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const currentState = useAppStore.getState();
        useAppStore.setState({
          lang: parsed.lang || currentState.lang,
          theme: parsed.theme || currentState.theme,
          selectedBook: parsed.selectedBook || null,
          bookCard: parsed.bookCard || currentState.bookCard,
          introText: parsed.introText || "",
          questions: parsed.questions || currentState.questions,
        });
        if (parsed.theme) {
          document.documentElement.setAttribute("data-theme", parsed.theme);
        }
      } catch (err) {
        console.error("Failed to parse JSON", err);
      }
    };
    reader.readAsText(file);
    if (fileRef.current) fileRef.current.value = "";
  };

  const currentTheme = themes.find((th) => th.id === theme) || themes[0];

  return (
    <div className="flex items-center gap-1.5 relative">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full w-9 h-9 flex items-center justify-center text-base bg-secondary hover:scale-110 transition-transform border border-border"
        >
          {currentTheme.emoji}
        </button>
        
        {isOpen && (
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 flex gap-1.5 rounded-full bg-card shadow-xl p-1.5 border border-border z-50 animate-in fade-in zoom-in-95 duration-200">
            {themes.map((th) => (
              <button
                key={th.id}
                onClick={() => {
                  setTheme(th.id);
                  setIsOpen(false);
                }}
                className={`rounded-full w-9 h-9 flex items-center justify-center text-xl transition-all duration-200 hover:scale-110 ${
                  theme === th.id ? "scale-110 bg-secondary shadow-md" : "hover:bg-secondary/50"
                }`}
              >
                {th.emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      <button onClick={exportData} title={t("downloadJson", lang)} className="rounded-full w-9 h-9 flex items-center justify-center bg-secondary hover:bg-secondary/80 transition-colors border border-border">
        <Download size={16} className="text-muted-foreground" />
      </button>
      <button onClick={() => fileRef.current?.click()} title={t("uploadJson", lang)} className="rounded-full w-9 h-9 flex items-center justify-center bg-secondary hover:bg-secondary/80 transition-colors border border-border">
        <Upload size={16} className="text-muted-foreground" />
      </button>
      <input type="file" ref={fileRef} accept=".json" onChange={importData} className="hidden" />
    </div>
  );
}
