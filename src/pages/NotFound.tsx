import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";

const NotFound = () => {
  const lang = useAppStore((s) => s.lang);
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card-activity text-center space-y-4 max-w-sm w-full">
        <p className="text-5xl" aria-hidden="true">📚</p>
        <h1 className="text-3xl">404</h1>
        <p className="text-muted-foreground">{t("notFoundTitle", lang)}</p>
        <a href="/" className="btn-cute">
          {t("goHome", lang)}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
