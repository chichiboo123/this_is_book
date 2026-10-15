import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";

interface CardShellProps {
  children: React.ReactNode;
  borderColor?: string;
  className?: string;
}

/** 미리보기·내보내기 카드 공통 틀 — 하단에 앱 브랜드 표기 */
export default function CardShell({ children, borderColor, className = "" }: CardShellProps) {
  const lang = useAppStore((s) => s.lang);
  return (
    <div
      className={`w-full rounded-[28px] overflow-hidden bg-white text-[#1f2430] border-2 shadow-[0_18px_40px_-24px_rgba(30,40,80,0.45)] ${className}`}
      style={{ borderColor: borderColor ?? "hsl(var(--primary) / 0.45)" }}
    >
      {children}
      <div className="flex items-center justify-between px-5 py-2.5 text-[11px] text-[#767676] border-t border-black/5 bg-black/[0.015]">
        <span className="font-bold tracking-wide">📚 {t("brandMark", lang)}</span>
        <span>{new Date().toLocaleDateString(lang === "ko" ? "ko-KR" : lang)}</span>
      </div>
    </div>
  );
}
