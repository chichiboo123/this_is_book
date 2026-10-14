import { createPortal } from "react-dom";
import { cardRefs, exportStageRef } from "@/lib/exportCard";
import BookCardPreview from "./BookCardPreview";
import IntroCardPreview from "./IntroCardPreview";
import QuestionCardPreview from "./QuestionCardPreview";

/**
 * 내보내기 전용 숨김 렌더링 — 화면 밖에 고정 폭으로 항상 마운트.
 * 화면에 보이는 미리보기와 관계없이 동일한 크기·모양으로 저장된다.
 */
export default function ExportStage() {
  return createPortal(
    <div
      ref={exportStageRef}
      aria-hidden="true"
      style={{ position: "fixed", top: 0, left: "-10000px", width: "420px", pointerEvents: "none" }}
    >
      {/* 카드 둘레에 여백을 두어 그림자·모서리가 잘리지 않게 */}
      <div ref={cardRefs.bookCard} style={{ padding: 16, background: "#ffffff" }}>
        <BookCardPreview />
      </div>
      <div ref={cardRefs.introCard} style={{ padding: 16, background: "#ffffff" }}>
        <IntroCardPreview />
      </div>
      <div ref={cardRefs.questionCard} style={{ padding: 16, background: "#ffffff" }}>
        <QuestionCardPreview />
      </div>
    </div>,
    document.body
  );
}
