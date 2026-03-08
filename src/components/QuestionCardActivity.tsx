import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";

export default function QuestionCardActivity() {
  const { lang, questions, setQuestions, addQuestion, selectedBook } = useAppStore();

  const updateQ = (id: string, field: "question" | "answer", value: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)));
  };

  return (
    <div className="space-y-4">
      <h2 className="section-title">{t("questionCardTitle", lang)}</h2>
      {selectedBook && (
        <p className="text-sm text-muted-foreground">
          📖 {selectedBook.title} — {selectedBook.authors?.join(", ")}
        </p>
      )}

      <div className="space-y-4">
        {questions.map((q, i) => (
          <div key={q.id} className="space-y-2 bg-secondary/30 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">❓</span>
              <span className="font-bold text-sm text-foreground">
                {t("questionLabel", lang)} {i + 1}
              </span>
            </div>
            <textarea
              className="textarea-cute w-full min-h-[60px]"
              placeholder={t("questionPlaceholder", lang)}
              value={q.question}
              onChange={(e) => updateQ(q.id, "question", e.target.value)}
            />
            <div className="flex items-center gap-2">
              <span className="text-lg">💡</span>
              <span className="font-bold text-sm text-foreground">{t("answerLabel", lang)}</span>
            </div>
            <textarea
              className="textarea-cute w-full min-h-[60px]"
              placeholder={t("answerPlaceholder", lang)}
              value={q.answer}
              onChange={(e) => updateQ(q.id, "answer", e.target.value)}
            />
          </div>
        ))}
      </div>

      <button onClick={addQuestion} className="btn-cute w-full">
        {t("addQuestion", lang)}
      </button>
    </div>
  );
}
