import { useRef } from "react";
import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeSelector from "@/components/ThemeSelector";
import BookSearch from "@/components/BookSearch";
import BookCardActivity from "@/components/BookCardActivity";
import IntroCardActivity from "@/components/IntroCardActivity";
import QuestionCardActivity from "@/components/QuestionCardActivity";
import BookCardPreview from "@/components/BookCardPreview";
import IntroCardPreview from "@/components/IntroCardPreview";
import QuestionCardPreview from "@/components/QuestionCardPreview";
import ExportToolbar from "@/components/ExportToolbar";

const Index = () => {
  const { lang } = useAppStore();
  const bookCardRef = useRef<HTMLDivElement>(null!);
  const introCardRef = useRef<HTMLDivElement>(null!);
  const questionCardRef = useRef<HTMLDivElement>(null!);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-2xl tracking-tight">
            📚 {t("appTitle", lang)}
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            <ThemeSelector />
            <LanguageToggle />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        {/* Subtitle */}
        <p className="text-center text-lg text-muted-foreground font-bold">
          {t("appSubtitle", lang)}
        </p>

        {/* Book Search */}
        <section className="card-activity">
          <BookSearch />
        </section>

        {/* Book Card Activity + Preview */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="card-activity">
            <BookCardActivity />
          </div>
          <div ref={bookCardRef}>
            <BookCardPreview />
          </div>
        </section>

        {/* Intro Card Activity + Preview */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="card-activity">
            <IntroCardActivity />
          </div>
          <div ref={introCardRef}>
            <IntroCardPreview />
          </div>
        </section>

        {/* Question Card Activity + Preview */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="card-activity">
            <QuestionCardActivity />
          </div>
          <div ref={questionCardRef}>
            <QuestionCardPreview />
          </div>
        </section>

        {/* Export */}
        <section>
          <ExportToolbar
            cardRefs={{
              bookCard: bookCardRef,
              introCard: introCardRef,
              questionCard: questionCardRef,
            }}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-muted-foreground">
        <a
          href="https://litt.ly/chichiboo"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          {t("footer", lang)}
        </a>
      </footer>
    </div>
  );
};

export default Index;
