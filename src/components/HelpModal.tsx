import { useState } from "react";
import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";
import { HelpCircle, X } from "lucide-react";

const helpContent = {
  ko: [
    {
      emoji: "🔍",
      title: "1단계 — 책 검색",
      desc: "상단 검색창에서 책 제목/저자를 검색해 책을 선택하세요. 책 정보(부제, ISBN, 설명 등 가능한 항목)가 자동으로 카드에 반영됩니다.",
    },
    {
      emoji: "🎭",
      title: "2단계 — 책 카드 만들기",
      desc: "책 속 등장인물을 분석해보세요! 이름, 좋아하는 것/싫어하는 것, 특징, 자주 하는 말을 입력하고, 어울리는 색깔과 이모지를 골라보세요. 그림을 직접 그리거나 이미지를 업로드할 수도 있어요.",
    },
    {
      emoji: "📝",
      title: "3단계 — 소개 카드 만들기",
      desc: "이 책을 아직 읽지 않은 친구들에게 소개하는 글을 써보세요! 이미지도 첨부할 수 있어요.",
    },
    {
      emoji: "❓",
      title: "4단계 — 질문 카드 만들기",
      desc: "책을 읽으면서 떠오른 질문을 적어보세요. 나의 답은 선택 사항이에요. 입력하지 않으면 카드에 표시되지 않아요.",
    },
    {
      emoji: "💾",
      title: "데이터 저장 & 복원",
      desc: "오른쪽 상단의 💾 아이콘으로 작업 내용을 JSON 파일로 저장할 수 있어요. 나중에 📂 아이콘으로 불러와서 이어서 작업할 수 있답니다!",
    },
    {
      emoji: "📥",
      title: "카드 내보내기",
      desc: "페이지 하단의 '내보내기' 섹션에서 각 카드를 이미지로 저장하거나 클립보드에 복사할 수 있어요.",
    },
    {
      emoji: "🎨",
      title: "테마 & 언어",
      desc: "오른쪽 상단에서 4가지 테마 색상을 선택하고, 한국어/영어/일본어/중국어로 언어를 변경할 수 있어요.",
    },
  ],
  en: [
    {
      emoji: "🔍",
      title: "Step 1 — Search a Book",
      desc: "Search by title or author in the top search box, then select a book. Available fields (subtitle, ISBN, description, etc.) are automatically applied to your card.",
    },
    {
      emoji: "🎭",
      title: "Step 2 — Book Card",
      desc: "Analyze a character from the book! Enter their name, likes/dislikes, features, and catchphrase. Pick a matching color and emoji. You can also draw or upload an image.",
    },
    {
      emoji: "📝",
      title: "Step 3 — Intro Card",
      desc: "Write an introduction to recommend this book to friends who haven't read it yet! You can also attach an image.",
    },
    {
      emoji: "❓",
      title: "Step 4 — Question Card",
      desc: "Write questions that came to mind while reading. Answers are optional — if left blank, they won't appear on the card.",
    },
    {
      emoji: "💾",
      title: "Save & Restore Data",
      desc: "Use the 💾 icon in the top-right to save your work as a JSON file. Use 📂 to restore it later and continue working!",
    },
    {
      emoji: "📥",
      title: "Export Cards",
      desc: "In the 'Export' section at the bottom, save each card as an image or copy it to your clipboard.",
    },
    {
      emoji: "🎨",
      title: "Theme & Language",
      desc: "Choose from 4 theme colors and switch between Korean/English/Japanese/Chinese in the top-right.",
    },
  ],
  ja: [
    {
      emoji: "🔍",
      title: "ステップ1 — 本を検索",
      desc: "上の検索ボックスでタイトルや著者を検索して本を選んでください。取得できる情報（サブタイトル、ISBN、説明など）が自動でカードに反映されます。",
    },
    {
      emoji: "🎭",
      title: "ステップ2 — ブックカード",
      desc: "登場人物を分析しよう！名前、好き嫌い、特徴、口癖を入力し、似合う色と絵文字を選ぼう。絵を描いたり画像をアップロードもできます。",
    },
    {
      emoji: "📝",
      title: "ステップ3 — 紹介カード",
      desc: "まだ読んでいない友達にこの本を紹介する文を書いてみよう！画像も添付できます。",
    },
    {
      emoji: "❓",
      title: "ステップ4 — 質問カード",
      desc: "読書中に浮かんだ質問を書いてみよう。答えは任意です。空白のままだとカードに表示されません。",
    },
    {
      emoji: "💾",
      title: "データ保存・復元",
      desc: "右上の💾アイコンで作業内容をJSONファイルとして保存できます。📂アイコンで後から読み込んで続きを作業できます！",
    },
    {
      emoji: "📥",
      title: "カードのエクスポート",
      desc: "ページ下部の「エクスポート」セクションで、各カードを画像として保存またはクリップボードにコピーできます。",
    },
    {
      emoji: "🎨",
      title: "テーマ・言語",
      desc: "右上から4種類のテーマカラーを選び、言語を切り替えられます。",
    },
  ],
  zh: [
    {
      emoji: "🔍",
      title: "第1步 — 搜索书籍",
      desc: "在顶部搜索框中按书名或作者搜索并选择书籍。可获取的信息（副标题、ISBN、简介等）会自动应用到卡片中。",
    },
    {
      emoji: "🎭",
      title: "第2步 — 书卡",
      desc: "分析书中的人物！输入名字、喜欢/讨厌的事物、特征和口头禅。选择搭配的颜色和表情。也可以画画或上传图片。",
    },
    {
      emoji: "📝",
      title: "第3步 — 介绍卡",
      desc: "写一篇向还没读过这本书的朋友推荐的介绍文！也可以附加图片。",
    },
    {
      emoji: "❓",
      title: "第4步 — 问题卡",
      desc: "写下阅读时想到的问题。回答是可选的——如果不填写，卡片上不会显示。",
    },
    {
      emoji: "💾",
      title: "保存和恢复数据",
      desc: "使用右上角的💾图标将工作内容保存为JSON文件。稍后使用📂图标加载并继续工作！",
    },
    {
      emoji: "📥",
      title: "导出卡片",
      desc: "在底部的「导出」区域，将每张卡片保存为图片或复制到剪贴板。",
    },
    {
      emoji: "🎨",
      title: "主题和语言",
      desc: "在右上角选择4种主题颜色，并切换中文/韩语/英语/日语。",
    },
  ],
};

export default function HelpModal() {
  const { lang } = useAppStore();
  const [open, setOpen] = useState(false);
  const content = helpContent[lang] ?? helpContent.ko;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center w-9 h-9 rounded-full bg-secondary hover:bg-secondary/80 transition-colors border border-border"
        title={t("howToUse", lang)}
      >
        <HelpCircle size={18} className="text-muted-foreground" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg border border-border sm:m-4"
            style={{ maxHeight: "85dvh", display: "flex", flexDirection: "column" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border" style={{ flexShrink: 0 }}>
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-bold truncate">📚 {t("howToUse", lang)}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">created by. 교육뮤지컬 꿈꾸는 치수쌤</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full hover:bg-secondary transition-colors ml-2"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div
              className="p-4 sm:p-5 space-y-3 sm:space-y-4 pb-safe"
              style={{ overflowY: "auto", flex: "1 1 0%", minHeight: 0, paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom))" }}
            >
              {content.map((item, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl bg-secondary/40">
                  <span className="text-xl sm:text-2xl flex-shrink-0">{item.emoji}</span>
                  <div className="min-w-0">
                    <p className="font-bold text-sm mb-1">{item.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}

              <div className="mt-3 p-3 sm:p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
                <p className="text-sm font-bold text-primary">💌 도움이 필요하면 언제든지 물어보세요!</p>
                <a
                  href="https://litt.ly/chichiboo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors mt-1 block"
                >
                  교육뮤지컬 꿈꾸는 치수쌤 →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
