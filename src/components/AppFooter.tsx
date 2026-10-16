import { Link } from "react-router-dom";
import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";
import Icon from "@/components/Icon";

/** 치수쌤 웹앱 표준 푸터 + 데이터 출처 + 이용약관·개인정보 처리방침 */
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
          href="https://developers.kakao.com/docs/latest/ko/daum-search/dev-guide#search-book"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-[#006DD2] transition-colors"
        >
          Kakao
        </a>
        {" · "}
        <a
          href="https://developers.google.com/books"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-[#006DD2] transition-colors"
        >
          Google Books
        </a>
      </p>
      {/* 개인정보 처리방침은 다른 고지와 구분되도록 굵게·강조색으로 표시 (개인정보 처리방침 작성지침) */}
      <nav aria-label={`${t("terms", lang)} · ${t("privacy", lang)}`} className="text-xs text-[#767676]">
        <Link to="/terms" className="hover:text-[#006DD2] hover:underline underline-offset-2 transition-colors">
          {t("terms", lang)}
        </Link>
        <span className="mx-2 text-[#B2B2B2]" aria-hidden="true">|</span>
        <Link to="/privacy" className="font-bold text-[#006DD2] hover:underline underline-offset-2">
          {t("privacy", lang)}
        </Link>
      </nav>
    </footer>
  );
}
