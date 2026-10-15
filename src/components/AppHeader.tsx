import { useRef, useState } from "react";
import { toast } from "sonner";
import { useAppStore, type ThemeId } from "@/lib/useAppStore";
import { t, LANG_LABELS, type Lang } from "@/lib/i18n";
import { downloadBackup, restoreBackup } from "@/lib/backup";
import booksIcon from "@/assets/books-icon.png";
import Icon from "@/components/Icon";
import HelpModal from "@/components/HelpModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const THEMES: { id: ThemeId; labelKey: string; swatch: string }[] = [
  { id: "blue", labelKey: "themeBlue", swatch: "hsl(210 70% 74%)" },
  { id: "green", labelKey: "themeGreen", swatch: "hsl(150 50% 74%)" },
  { id: "yellow", labelKey: "themeYellow", swatch: "hsl(45 85% 74%)" },
  { id: "pink", labelKey: "themePink", swatch: "hsl(340 70% 74%)" },
];

const LANGS: Lang[] = ["ko", "en", "ja", "zh"];

function HeaderTip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="hidden sm:block">{label}</TooltipContent>
    </Tooltip>
  );
}

export default function AppHeader() {
  const { lang, setLang, theme, setTheme, reset } = useAppStore();
  const [resetOpen, setResetOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const currentTheme = THEMES.find((th) => th.id === theme) ?? THEMES[0];

  const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      await restoreBackup(file);
      toast.success(t("backupRestored", useAppStore.getState().lang));
    } catch {
      toast.error(t("backupInvalid", lang));
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-card/75 backdrop-blur-xl border-b border-border/70">
      <div className="max-w-5xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-2 min-w-0 rounded-lg"
        >
          <img src={booksIcon} alt="" className="w-7 h-7 sm:w-8 sm:h-8" />
          <span className="flex items-baseline gap-1.5 min-w-0">
            <span className="text-2xl sm:text-[28px] font-title leading-none whitespace-nowrap">책임</span>
            <span className="hidden min-[420px]:inline text-xs sm:text-sm text-muted-foreground font-bold whitespace-nowrap">
              This is Book
            </span>
          </span>
        </a>

        <nav className="flex items-center gap-1.5 sm:gap-2" aria-label="app menu">
          {/* 테마 */}
          <DropdownMenu>
            <HeaderTip label={t("theme", lang)}>
              <DropdownMenuTrigger className="icon-btn" aria-label={t("theme", lang)}>
                <span
                  className="w-5 h-5 rounded-full ring-2 ring-card shadow-inner"
                  style={{ backgroundColor: currentTheme.swatch }}
                />
              </DropdownMenuTrigger>
            </HeaderTip>
            <DropdownMenuContent align="end" className="rounded-2xl p-1.5 min-w-[11rem]">
              <DropdownMenuLabel className="text-xs text-muted-foreground">{t("theme", lang)}</DropdownMenuLabel>
              {THEMES.map((th) => (
                <DropdownMenuItem
                  key={th.id}
                  onSelect={() => setTheme(th.id)}
                  className="gap-3 rounded-xl py-2 text-[15px] cursor-pointer"
                >
                  <span className="w-5 h-5 rounded-full border border-black/5" style={{ backgroundColor: th.swatch }} />
                  <span className="flex-1">{t(th.labelKey, lang)}</span>
                  {theme === th.id && <Icon name="check" size={18} className="text-primary-strong" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 언어 */}
          <DropdownMenu>
            <HeaderTip label={t("language", lang)}>
              <DropdownMenuTrigger className="icon-btn w-auto px-2.5 sm:px-3 gap-1" aria-label={t("language", lang)}>
                <Icon name="translate" size={18} className="hidden sm:inline-block" />
                <span className="text-xs font-bold">{lang.toUpperCase()}</span>
              </DropdownMenuTrigger>
            </HeaderTip>
            <DropdownMenuContent align="end" className="rounded-2xl p-1.5 min-w-[9rem]">
              {LANGS.map((l) => (
                <DropdownMenuItem
                  key={l}
                  onSelect={() => setLang(l)}
                  className="gap-2 rounded-xl py-2 text-[15px] cursor-pointer"
                  lang={l}
                >
                  <span className="flex-1">{LANG_LABELS[l]}</span>
                  {lang === l && <Icon name="check" size={18} className="text-primary-strong" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 사용법 */}
          <HelpModal />

          {/* 더보기: 파일 저장/불러오기/초기화 */}
          <DropdownMenu>
            <HeaderTip label={t("moreMenu", lang)}>
              <DropdownMenuTrigger className="icon-btn" aria-label={t("moreMenu", lang)}>
                <Icon name="more_vert" size={20} />
              </DropdownMenuTrigger>
            </HeaderTip>
            <DropdownMenuContent align="end" className="rounded-2xl p-1.5 min-w-[13rem]">
              <DropdownMenuItem
                onSelect={() => {
                  downloadBackup();
                  toast.success(t("backupSaved", lang));
                }}
                className="gap-3 rounded-xl py-2.5 text-[15px] cursor-pointer"
              >
                <Icon name="save" size={20} className="text-muted-foreground" />
                {t("downloadJson", lang)}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => fileRef.current?.click()}
                className="gap-3 rounded-xl py-2.5 text-[15px] cursor-pointer"
              >
                <Icon name="folder_open" size={20} className="text-muted-foreground" />
                {t("uploadJson", lang)}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => setResetOpen(true)}
                className="gap-3 rounded-xl py-2.5 text-[15px] cursor-pointer text-destructive focus:text-destructive"
              >
                <Icon name="restart_alt" size={20} />
                {t("resetAll", lang)}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <input type="file" ref={fileRef} accept=".json,application/json" onChange={handleRestore} className="hidden" />
        </nav>
      </div>

      <ConfirmDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        title={t("resetTitle", lang)}
        description={t("resetDesc", lang)}
        confirmLabel={t("reset", lang)}
        onConfirm={reset}
      />
    </header>
  );
}
