import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";
import BookContextBar from "./BookContextBar";
import Icon from "./Icon";

const IDEA_KEYS = ["qIdea1", "qIdea2", "qIdea3", "qIdea4", "qIdea5"];
const MAX_QUESTIONS = 8;

export default function QuestionCardActivity() {
  const {
    lang, questions, setQuestions, addQuestion, removeQuestion,
    showQuestionBookCover, setShowQuestionBookCover,
  } = useAppStore();

  const updateQ = (id: string, field: "question" | "answer", value: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)));
  };

  /** 아이디어: 비어 있는 첫 질문 칸에 채우고, 없으면 새 질문으로 추가 */
  const applyIdea = (key: string) => {
    const text = t(key, lang);
    const empty = questions.find((q) => !q.question.trim());
    if (empty) updateQ(empty.id, "question", text);
    else if (questions.length < MAX_QUESTIONS) addQuestion(text);
  };

  const canAdd = questions.length < MAX_QUESTIONS;

  return (
    <div className="space-y-5">
      <BookContextBar idPrefix="qc" showCover={showQuestionBookCover} onShowCoverChange={setShowQuestionBookCover} />

      <div className="space-y-2">
        <p className="text-sm font-bold text-muted-foreground">💡 {t("questionIdeas", lang)}</p>
        <div className="flex flex-wrap gap-2">
          {IDEA_KEYS.map((key) => (
            <button key={key} type="button" onClick={() => applyIdea(key)} className="chip text-left" disabled={!canAdd && !questions.some((q) => !q.question.trim())}>
              {t(key, lang)}
            </button>
          ))}
        </div>
      </div>

      <ol className="space-y-3">
        {questions.map((q, i) => (
          <li key={q.id} className="rounded-2xl border border-border bg-secondary/40 p-3 sm:p-4 space-y-2.5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor={`q-${q.id}`} className="flex items-center gap-2 font-bold text-[15px]">
                <span className="inline-flex items-center justify-center min-w-8 h-7 px-2 rounded-full bg-primary text-primary-foreground text-sm">
                  Q{i + 1}
                </span>
                {t("questionLabel", lang)}
              </label>
              {(questions.length > 1 || q.question || q.answer) && (
                <button
                  type="button"
                  onClick={() => removeQuestion(q.id)}
                  aria-label={`${t("removeQuestion", lang)} ${i + 1}`}
                  title={t("removeQuestion", lang)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Icon name="delete_outline" size={20} />
                </button>
              )}
            </div>
            <textarea
              id={`q-${q.id}`}
              className="textarea-cute w-full min-h-[72px]"
              placeholder={t("questionPlaceholder", lang)}
              value={q.question}
              maxLength={200}
              onChange={(e) => updateQ(q.id, "question", e.target.value)}
            />
            <label htmlFor={`a-${q.id}`} className="flex items-center gap-1.5 text-sm font-bold text-foreground/80 pt-1">
              <span aria-hidden="true">💡</span>
              {t("answerLabel", lang)}
              <span className="font-normal text-muted-foreground">({t("optional", lang)})</span>
            </label>
            <textarea
              id={`a-${q.id}`}
              className="textarea-cute w-full min-h-[72px]"
              placeholder={t("answerPlaceholder", lang)}
              value={q.answer}
              maxLength={300}
              onChange={(e) => updateQ(q.id, "answer", e.target.value)}
            />
          </li>
        ))}
      </ol>

      {canAdd && (
        <button type="button" onClick={() => addQuestion()} className="btn-outline-cute w-full border-dashed">
          <Icon name="add" size={20} />
          {t("addQuestion", lang)}
        </button>
      )}
    </div>
  );
}
