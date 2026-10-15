import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";
import CardShell from "./CardShell";

export default function QuestionCardPreview() {
  const { questions, selectedBook, customTitle, showQuestionBookCover, lang } = useAppStore();
  const title = customTitle || selectedBook?.title;
  const cover = showQuestionBookCover ? selectedBook?.imageLinks?.thumbnail : undefined;
  const filled = questions.filter((q) => q.question.trim());

  return (
    <CardShell>
      <div className="px-5 pt-4 pb-3 bg-gradient-to-br from-accent/50 to-primary/40 flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#1f2430]/70">MY QUESTIONS</p>
          <h3 className="font-title text-[22px] mt-0.5">❓ {t("questionCardTitle", lang)}</h3>
          {title && <p className="text-xs font-bold mt-1 text-[#1f2430]/80 truncate">📖 {title}</p>}
        </div>
        {cover && <img src={cover} alt="" className="w-14 h-20 object-cover rounded-md shadow-md shrink-0" />}
      </div>

      <div className="p-5 space-y-3">
        {filled.length === 0 && (
          <p className="text-[15px] text-[#9aa0aa] text-center py-6">{t("questionPlaceholder", lang)}</p>
        )}
        {filled.map((q, i) => (
          <div key={q.id} className="rounded-2xl border border-black/5 bg-primary/10 p-3.5 space-y-2">
            <p className="flex gap-2 text-[15px] font-bold leading-snug break-keep">
              <span className="shrink-0 inline-flex items-center justify-center min-w-8 h-6 px-1.5 rounded-full bg-primary text-[12px]">
                Q{i + 1}
              </span>
              <span className="whitespace-pre-wrap">{q.question}</span>
            </p>
            {q.answer.trim() && (
              <p className="flex gap-2 text-sm leading-relaxed text-[#3d4250] break-keep">
                <span className="shrink-0 inline-flex items-center justify-center min-w-8 h-6 px-1.5 rounded-full bg-white border border-black/10 text-[12px] font-bold">
                  A
                </span>
                <span className="whitespace-pre-wrap">{q.answer}</span>
              </p>
            )}
          </div>
        ))}
      </div>
    </CardShell>
  );
}
