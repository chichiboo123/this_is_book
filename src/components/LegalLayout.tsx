import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";
import booksIcon from "@/assets/books-icon.png";
import Icon from "@/components/Icon";
import AppFooter from "@/components/AppFooter";

export interface LegalSection {
  id: string;
  title: string;
  body: React.ReactNode;
}

interface LegalLayoutProps {
  title: string;
  effectiveDate: string;
  /** 본문 앞 안내 (서문·한눈에 보기 등) */
  intro?: React.ReactNode;
  sections: LegalSection[];
  /** 본문 뒤 부칙 */
  outro?: React.ReactNode;
}

/** 이용약관 · 개인정보 처리방침 공통 틀 (법령에 따라 본문은 한국어로 제공) */
export default function LegalLayout({ title, effectiveDate, intro, sections, outro }: LegalLayoutProps) {
  const lang = useAppStore((s) => s.lang);
  const { hash } = useLocation();

  useEffect(() => {
    const prev = document.title;
    document.title = `${title} · 책임 This is Book`;
    return () => {
      document.title = prev;
    };
  }, [title]);

  // 푸터 링크로 들어오면 맨 위부터, 목차 주소(#…)로 들어오면 해당 조항으로
  useEffect(() => {
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [hash]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-card/75 backdrop-blur-xl border-b border-border/70">
        <div className="max-w-3xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
          <Link to="/" className="flex items-center gap-2 min-w-0 rounded-lg">
            <img src={booksIcon} alt="" className="w-7 h-7 sm:w-8 sm:h-8" />
            <span className="text-2xl sm:text-[28px] font-title leading-none whitespace-nowrap">책임</span>
          </Link>
          <Link to="/" className="btn-ghost-cute">
            <Icon name="home" size={18} />
            {t("goHome", lang)}
          </Link>
        </div>
      </header>

      <main className="w-full max-w-3xl mx-auto px-4 py-6 sm:py-8 flex-1">
        <article lang="ko" className="card-activity legal-doc space-y-6">
          <header className="space-y-1.5 pb-4 border-b border-border">
            <h1 className="text-[28px] leading-snug">{title}</h1>
            <p className="text-sm text-muted-foreground">시행일: {effectiveDate}</p>
            {lang !== "ko" && (
              <p className="text-sm text-muted-foreground flex items-center gap-1.5" lang={lang}>
                <Icon name="translate" size={16} />
                {t("legalKoreanOnly", lang)}
              </p>
            )}
          </header>

          {intro}

          <nav aria-label="목차" className="rounded-2xl bg-secondary/60 p-4">
            <p className="font-bold mb-2">목차</p>
            <ol className="!list-none !pl-0 grid sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>{s.title}</a>
                </li>
              ))}
            </ol>
          </nav>

          {sections.map((s) => (
            <section key={s.id} id={s.id} className="space-y-2.5 scroll-mt-20">
              <h2>{s.title}</h2>
              {s.body}
            </section>
          ))}

          {outro}
        </article>
      </main>

      <AppFooter />
    </div>
  );
}
