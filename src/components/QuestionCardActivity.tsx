import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";

export default function QuestionCardActivity() {
  const { lang, questions, setQuestions, addQuestion, selectedBook, customTitle, setCustomTitle, showQuestionBookCover, setShowQuestionBookCover } = useAppStore();

  const updateQ = (id: string, field: "question" | "answer", value: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)));
  };

  return (
    <div className="space-y-4">
      <h2 className="section-title">{t("questionCardTitle", lang)}</h2>
      {selectedBook && (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <span className="shrink-0">📖</span>
          <input
            className="bg-transparent border-b border-dashed border-muted-foreground/40 focus:border-primary focus:outline-none flex-1 min-w-0 text-sm text-muted-foreground px-0.5"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            title="책 제목을 직접 수정할 수 있어요"
          />
          <span className="shrink-0 text-xs">— {selectedBook.authors?.join(", ")}</span>
        </div>
      )}

      {/* 책 표지 포함 여부 */}
      {selectedBook?.imageLinks?.thumbnail && (
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <div
            onClick={() => setShowQuestionBookCover(!showQuestionBookCover)}
            className={`w-10 h-6 rounded-full transition-colors relative flex-shrink-0 ${
              showQuestionBookCover ? "bg-primary" : "bg-secondary border border-border"
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                showQuestionBookCover ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </div>
          <span className="text-xs font-bold text-muted-foreground">
            {lang === "ko" ? "책 표지 이미지 포함" : lang === "ja" ? "表紙画像を含む" : lang === "zh" ? "包含书封面" : "Show book cover"}
          </span>
          {showQuestionBookCover && (
            <img
              src={selectedBook.imageLinks.thumbnail}
              alt="cover"
              className="w-8 h-11 object-cover rounded shadow-sm ml-auto"
            />
          )}
        </label>
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
