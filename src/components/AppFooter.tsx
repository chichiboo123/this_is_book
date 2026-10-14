import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";
import Icon from "@/components/Icon";

/** 치수쌤 웹앱 표준 푸터 + 데이터 출처 */
export default function AppFooter() {
  const lang = useAppStore((s) => s.lang);
  return (
    <footer className="mt-auto w-full bg-[#F5F5F5]/80 border-t border-[#B2B2B2]/60 px-6 py-5 text-center space-y-1.5 safe-bottom">
      <a
        href="https://litt.ly/chichiboo"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-[13px] text-[#767676] hover:text-[#006DD2] transition-colors"
      >
        <Icon name="auto_stories" size={16} />
        {t("footer", lang)}
      </a>
      <p className="text-xs text-[#767676]">
        {t("dataSource", lang)}:{" "}
        <a
          href="https://developers.naver.com/docs/serviceapi/search/book/book.md"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-[#006DD2] transition-colors"
        >
          NAVER Search API
        </a>
      </p>
    </footer>
  );
}
