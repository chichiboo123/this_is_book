import { useAppStore } from "@/lib/useAppStore";
import booksIcon from "@/assets/books-icon.png";
import { t } from "@/lib/i18n";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeSelector from "@/components/ThemeSelector";
import HelpModal from "@/components/HelpModal";
import BookSearch from "@/components/BookSearch";
import BookCardActivity from "@/components/BookCardActivity";
import IntroCardActivity from "@/components/IntroCardActivity";
import QuestionCardActivity from "@/components/QuestionCardActivity";
import BookCardPreview from "@/components/BookCardPreview";
import IntroCardPreview from "@/components/IntroCardPreview";
import QuestionCardPreview from "@/components/QuestionCardPreview";
import ExportToolbar from "@/components/ExportToolbar";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const { lang } = useAppStore();

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2">
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-1.5 min-w-0 hover:opacity-80 transition-opacity cursor-pointer">
            <img src={booksIcon} alt="books" className="w-5 h-5 sm:w-7 sm:h-7" />
            <span className="text-xl sm:text-3xl tracking-tight font-title">책임</span>
            <span className="text-xs sm:text-sm text-muted-foreground font-bold">This is Book</span>
          </a>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <ThemeSelector />
            <LanguageToggle />
            <HelpModal />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6 sm:space-y-8">
        {/* Subtitle */}
        <p className="text-center text-sm sm:text-lg text-muted-foreground font-bold whitespace-pre-line leading-relaxed">
          {t("appSubtitle", lang)}
        </p>

        {/* Book Search */}
        <section className="card-activity">
          <BookSearch />
        </section>

        {/* Tabbed Cards Area */}
        <Tabs defaultValue="bookCard" className="w-full space-y-4 sm:space-y-6">
          <TabsList className="w-full grid grid-cols-3 bg-secondary/50 p-1 sm:p-1.5 rounded-xl h-auto">
            <TabsTrigger value="bookCard" className="py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-primary">
              {t("bookCardTitle", lang)}
            </TabsTrigger>
            <TabsTrigger value="introCard" className="py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-primary">
              {t("introCardTitle", lang)}
            </TabsTrigger>
            <TabsTrigger value="questionCard" className="py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-primary">
              {t("questionCardTitle", lang)}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookCard" className="mt-0 outline-none animate-in fade-in zoom-in-95 duration-200">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="card-activity">
                <BookCardActivity />
              </div>
              <div className="md:sticky md:top-24 h-fit">
                <BookCardPreview />
              </div>
            </section>
          </TabsContent>

          <TabsContent value="introCard" className="mt-0 outline-none animate-in fade-in zoom-in-95 duration-200">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="card-activity">
                <IntroCardActivity />
              </div>
              <div className="md:sticky md:top-24 h-fit">
                <IntroCardPreview />
              </div>
            </section>
          </TabsContent>

          <TabsContent value="questionCard" className="mt-0 outline-none animate-in fade-in zoom-in-95 duration-200">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="card-activity">
                <QuestionCardActivity />
              </div>
              <div className="md:sticky md:top-24 h-fit">
                <QuestionCardPreview />
              </div>
            </section>
          </TabsContent>
        </Tabs>

        {/* Export */}
        <section>
          <ExportToolbar />
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
