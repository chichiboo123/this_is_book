import { useState } from "react";
import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";
import { CARD_EMOJI, CARD_KEYS, cardStatus, type CardKey } from "@/lib/progress";
import { scrollToSection } from "@/lib/nav";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import Icon from "@/components/Icon";
import BookSearch from "@/components/BookSearch";
import CardWorkspace from "@/components/CardWorkspace";
import BookCardActivity from "@/components/BookCardActivity";
import IntroCardActivity from "@/components/IntroCardActivity";
import QuestionCardActivity from "@/components/QuestionCardActivity";
import BookCardPreview from "@/components/BookCardPreview";
import IntroCardPreview from "@/components/IntroCardPreview";
import QuestionCardPreview from "@/components/QuestionCardPreview";
import ExportToolbar from "@/components/ExportToolbar";
import ExportStage from "@/components/ExportStage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SUBTITLE_KEYS = ["appSubtitle", "appSubtitle2"] as const;

const CARD_DESC: Record<CardKey, string> = {
  bookCard: "bookCardDesc",
  introCard: "introCardDesc",
  questionCard: "questionCardDesc",
};

const Index = () => {
  const { lang, selectedBook, bookCard, introText, questions } = useAppStore();
  // 접속마다 두 문구 중 하나를 랜덤 고정 (렌더 중 변경 없음)
  const [subtitleKey] = useState(() => SUBTITLE_KEYS[Math.floor(Math.random() * SUBTITLE_KEYS.length)]);
  const [tab, setTab] = useState<CardKey>("bookCard");

  const status = cardStatus({ bookCard, introText, questions });
  const doneCount = CARD_KEYS.filter((k) => status[k]).length;

  const goTab = (key: CardKey) => {
    setTab(key);
    scrollToSection("step-make");
  };

  const steps = [
    { id: "step-pick", n: 1, label: t("stepPick", lang), done: !!selectedBook },
    { id: "step-make", n: 2, label: t("stepMake", lang), done: doneCount === 3 },
    { id: "step-share", n: 3, label: t("stepShare", lang), done: false },
  ];

  const workspaces: Record<CardKey, { activity: React.ReactNode; preview: React.ReactNode; next: { label: string; onClick: () => void } }> = {
    bookCard: {
      activity: <BookCardActivity />,
      preview: <BookCardPreview />,
      next: { label: t("nextStep", lang, { name: t("introCard", lang) }), onClick: () => goTab("introCard") },
    },
    introCard: {
      activity: <IntroCardActivity />,
      preview: <IntroCardPreview />,
      next: { label: t("nextStep", lang, { name: t("questionCard", lang) }), onClick: () => goTab("questionCard") },
    },
    questionCard: {
      activity: <QuestionCardActivity />,
      preview: <QuestionCardPreview />,
      next: { label: t("goExport", lang), onClick: () => scrollToSection("step-share") },
    },
  };

  return (
    <div id="top" className="min-h-screen flex flex-col">
      <AppHeader />

      <main className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8 flex-1">
        {/* Hero */}
        <div className="text-center space-y-4">
          <p className="text-[15px] sm:text-lg text-foreground/85 font-grandiflora whitespace-pre-line leading-relaxed break-keep">
            {t(subtitleKey, lang)}
          </p>
          <ol className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm">
            {steps.map((s, i) => (
              <li key={s.id} className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => scrollToSection(s.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full pl-1 pr-3 py-1 font-bold border transition-colors ${
                    s.done ? "bg-primary/25 border-primary/60" : "bg-card/70 border-border hover:border-primary"
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${s.done ? "bg-primary-strong text-white" : "bg-secondary"}`}>
                    {s.done ? <Icon name="check" size={14} /> : s.n}
                  </span>
                  {s.label}
                </button>
                {i < steps.length - 1 && <Icon name="chevron_right" size={16} className="text-muted-foreground" />}
              </li>
            ))}
          </ol>
        </div>

        {/* 1. 책 고르기 */}
        <BookSearch />

        {/* 2. 카드 만들기 */}
        <section id="step-make" className="space-y-4 scroll-mt-20">
          <div className="flex flex-wrap items-end justify-between gap-2 px-1">
            <h2 className="flex items-center gap-2.5 section-title">
              <span className="step-badge">2</span>
              {t("stepMake", lang)}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
              <span className="font-bold text-primary-strong">{t("progressLabel", lang, { done: doneCount })}</span>
              <span aria-hidden="true">·</span>
              <Icon name="cloud_done" size={16} />
              {t("autoSaved", lang)}
            </p>
          </div>

          <Tabs value={tab} onValueChange={(v) => setTab(v as CardKey)} className="w-full space-y-4">
            <TabsList className="w-full grid grid-cols-3 gap-1 bg-card/80 border border-border p-1.5 rounded-3xl h-auto shadow-sm">
              {CARD_KEYS.map((key) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="relative flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 py-2 sm:py-2.5 px-1 rounded-[18px] text-muted-foreground data-[state=active]:bg-primary/30 data-[state=active]:text-foreground data-[state=active]:shadow-none whitespace-normal"
                >
                  <span className="text-xl sm:text-2xl leading-none" aria-hidden="true">{CARD_EMOJI[key]}</span>
                  <span className="text-left">
                    <span className="block text-[13px] sm:text-[15px] font-bold leading-tight">{t(key, lang)}</span>
                    <span className="hidden lg:block text-xs font-medium text-muted-foreground">{t(CARD_DESC[key], lang)}</span>
                  </span>
                  {status[key] && (
                    <span
                      className="absolute top-1 right-1 sm:static w-5 h-5 rounded-full bg-primary-strong text-white flex items-center justify-center"
                      aria-label={t("complete", lang)}
                    >
                      <Icon name="check" size={14} />
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {CARD_KEYS.map((key) => (
              <TabsContent key={key} value={key} className="mt-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                <CardWorkspace cardKey={key} {...workspaces[key]} />
              </TabsContent>
            ))}
          </Tabs>
        </section>

        {/* 3. 저장·공유 */}
        <ExportToolbar />
      </main>

      <AppFooter />
      <ExportStage />
    </div>
  );
};

export default Index;
