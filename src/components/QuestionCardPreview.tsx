import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";

export default function QuestionCardPreview() {
  const { questions, selectedBook, customTitle, showQuestionBookCover, lang } = useAppStore();

  return (
    <div className="rounded-2xl p-5 bg-gradient-to-br from-accent/10 to-primary/10 border-2 border-primary/20 space-y-3">
      <h3 className="font-title text-lg text-center">❓ {t("questionCardTitle", lang)}</h3>
      {selectedBook && (
        <p className="text-xs text-muted-foreground text-center">
          📖 {customTitle || selectedBook.title}
        </p>
      )}
      {showQuestionBookCover && selectedBook?.imageLinks?.thumbnail && (
        <div className="flex justify-center">
          <img
            src={selectedBook.imageLinks.thumbnail}
            alt="book cover"
            className="w-24 object-cover rounded-xl shadow-md"
          />
        </div>
      )}
      <div className="space-y-3">
        {questions.map((q, i) => (
          <div key={q.id} className="bg-card/60 rounded-xl p-3 space-y-1">
            <p className="text-sm font-bold">
              ❓ {t("questionLabel", lang)} {i + 1}: {q.question || "..."}
            </p>
            {q.answer && (
              <p className="text-sm text-muted-foreground">
                💡 {q.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
