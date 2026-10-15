import { describe, it, expect, beforeEach } from "vitest";
import { t } from "@/lib/i18n";
import { readableTextColor } from "@/lib/image";
import { cardStatus, hasAnyContent } from "@/lib/progress";
import { cardFileName } from "@/lib/exportCard";
import { restoreBackup } from "@/lib/backup";
import { useAppStore } from "@/lib/useAppStore";

describe("i18n", () => {
  it("변수를 치환하고 없는 언어는 한국어로 대체한다", () => {
    expect(t("resultsCount", "ko", { n: 5 })).toBe("검색 결과 5권");
    expect(t("progressLabel", "en", { done: 2 })).toBe("2/3 cards done");
    expect(t("unknown-key", "ja")).toBe("unknown-key");
  });
});

describe("readableTextColor", () => {
  it("밝은 배경엔 검정, 어두운 배경엔 흰 글자", () => {
    expect(readableTextColor("#FFF3B0")).toBe("#1a1a1a");
    expect(readableTextColor("#1A5F8A")).toBe("#ffffff");
    expect(readableTextColor("not-a-color")).toBe("#1a1a1a");
  });
});

describe("progress", () => {
  it("카드별 완성 여부를 판단한다", () => {
    const s = useAppStore.getState();
    expect(cardStatus(s)).toEqual({ bookCard: false, introCard: false, questionCard: false });
    expect(
      cardStatus({ ...s, bookCard: { ...s.bookCard, charName: "왕자" }, introText: " ", questions: [{ id: "1", question: "왜?", answer: "" }] })
    ).toEqual({ bookCard: true, introCard: false, questionCard: true });
    expect(hasAnyContent(s)).toBe(false);
    expect(hasAnyContent({ ...s, introImageUrl: "data:x" })).toBe(true);
  });
});

describe("cardFileName", () => {
  it("파일명에 쓸 수 없는 문자를 바꾼다", () => {
    expect(cardFileName("책 카드", "어린 왕자: 개정/판")).toBe("책_카드_어린_왕자_개정_판.png");
    expect(cardFileName("Intro Card", "")).toBe("Intro_Card.png");
  });
});

describe("store", () => {
  beforeEach(() => useAppStore.getState().reset());

  it("질문을 추가·삭제하고, 마지막 하나는 빈 질문으로 남긴다", () => {
    const { addQuestion, removeQuestion } = useAppStore.getState();
    addQuestion("두 번째");
    expect(useAppStore.getState().questions.map((q) => q.question)).toEqual(["", "두 번째"]);
    for (const q of useAppStore.getState().questions) removeQuestion(q.id);
    expect(useAppStore.getState().questions).toHaveLength(1);
    expect(useAppStore.getState().questions[0].question).toBe("");
  });

  it("이전 버전 작업 파일을 복원하면 빠진 값은 기본값/책 제목으로 채운다", async () => {
    useAppStore.setState({ introText: "이전 작업", introRating: 5 });
    const legacy = {
      lang: "ko",
      theme: "pink",
      selectedBook: { title: "어린 왕자", authors: ["생텍쥐페리"] },
      bookCard: { charName: "왕자", drawingDataUrl: "data:image/png;base64,AAA" },
      questions: [{ id: "1", question: "왜?", answer: "" }],
    };
    const file = new File([JSON.stringify(legacy)], "old.json", { type: "application/json" });
    await restoreBackup(file);
    const s = useAppStore.getState();
    expect(s.customTitle).toBe("어린 왕자");
    expect(s.introText).toBe("");
    expect(s.introRating).toBe(0);
    expect(s.theme).toBe("pink");
    expect(s.bookCard.charName).toBe("왕자");
    expect(s.bookCard.charColor).toBe("#A8D8EA");
    expect(s.bookCard.imageSource).toBe("draw");
  });

  it("형식이 맞지 않는 파일은 거부한다", async () => {
    await expect(restoreBackup(new File(["{}"], "x.json"))).rejects.toThrow();
    await expect(restoreBackup(new File(["not json"], "x.json"))).rejects.toThrow();
  });
});
