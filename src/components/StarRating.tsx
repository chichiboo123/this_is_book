import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";

interface StarRatingProps {
  value: number;
  onChange: (n: number) => void;
}

/** 별점 1~5 (같은 별을 다시 누르면 해제) */
export default function StarRating({ value, onChange }: StarRatingProps) {
  const lang = useAppStore((s) => s.lang);
  return (
    <div className="flex gap-1" role="radiogroup" aria-label={t("rating", lang)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={t("ratingStar", lang, { n })}
          onClick={() => onChange(value === n ? 0 : n)}
          className={`text-[32px] leading-none w-11 h-11 rounded-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ${
            n <= value ? "" : "grayscale opacity-30"
          }`}
        >
          ⭐
        </button>
      ))}
    </div>
  );
}
