import { useAppStore } from "@/lib/useAppStore";
import { t, type Lang } from "@/lib/i18n";
import Icon from "@/components/Icon";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const helpContent: Record<Lang, { icon: string; title: string; desc: string }[]> = {
  ko: [
    { icon: "search", title: "1단계 — 책 고르기", desc: "책 제목이나 지은이로 검색해서 책을 골라요. 표지 사진으로도 찾을 수 있고, 찾는 책이 없으면 직접 입력해도 돼요." },
    { icon: "theater_comedy", title: "2단계 — 책 카드", desc: "내가 고른 책이 캐릭터가 된다면 어떤 모습일까요? 이름, 좋아하는 것, 자주 하는 말을 상상해서 적고 그림도 그려 보세요." },
    { icon: "campaign", title: "3단계 — 소개 카드", desc: "아직 이 책을 읽지 않은 친구에게 추천하는 글을 써요. 추천 지수(별점)와 이미지도 넣을 수 있어요." },
    { icon: "help_center", title: "4단계 — 질문 카드", desc: "책을 읽으며 떠오른 질문을 적어요. 질문 아이디어를 눌러 시작해도 좋아요. 나의 답은 쓰지 않으면 카드에 보이지 않아요." },
    { icon: "download", title: "저장·공유하기", desc: "카드마다 미리보기 아래 버튼으로 바로 이미지 저장·복사·공유할 수 있어요. 맨 아래 '저장·공유하기'에서 여러 장을 한 번에 저장할 수도 있어요." },
    { icon: "save", title: "작업 이어 하기", desc: "작성한 내용은 이 기기에 자동 저장돼요. 다른 기기에서 이어 하려면 오른쪽 위 ⋮ 메뉴의 '작업 파일로 저장'과 '작업 파일 불러오기'를 이용하세요." },
    { icon: "palette", title: "테마 & 언어", desc: "오른쪽 위에서 4가지 테마 색과 한국어·영어·일본어·중국어를 고를 수 있어요." },
  ],
  en: [
    { icon: "search", title: "Step 1 — Pick a book", desc: "Search by title or author. You can also search with a cover photo, or type the book in yourself if you can't find it." },
    { icon: "theater_comedy", title: "Step 2 — Book Card", desc: "Imagine your book is a character! Give it a name, likes, a catchphrase, and draw how it looks." },
    { icon: "campaign", title: "Step 3 — Intro Card", desc: "Write a recommendation for friends who haven't read it yet. Add a star rating and an image too." },
    { icon: "help_center", title: "Step 4 — Question Card", desc: "Write questions that came to mind. Tap a question idea to get started. Blank answers won't appear on the card." },
    { icon: "download", title: "Save & share", desc: "Save, copy or share each card right under its preview, or save several at once in the 'Save & share' section at the bottom." },
    { icon: "save", title: "Continue later", desc: "Your work is auto-saved on this device. To continue on another device, use 'Save work to file' and 'Open work file' in the ⋮ menu." },
    { icon: "palette", title: "Theme & language", desc: "Choose from 4 theme colors and Korean/English/Japanese/Chinese in the top-right." },
  ],
  ja: [
    { icon: "search", title: "ステップ1 — 本をえらぶ", desc: "タイトルや著者で検索して本をえらびます。表紙の写真でも探せて、見つからなければ自分で入力もできます。" },
    { icon: "theater_comedy", title: "ステップ2 — ブックカード", desc: "本がキャラクターになったら？名前や好きなもの、口癖を考えて、絵もかいてみよう。" },
    { icon: "campaign", title: "ステップ3 — 紹介カード", desc: "まだ読んでいない友だちにすすめる文を書こう。おすすめ度（星）や画像も入れられます。" },
    { icon: "help_center", title: "ステップ4 — 質問カード", desc: "読みながら浮かんだ質問を書こう。質問アイデアをタップして始めてもOK。答えが空だとカードに表示されません。" },
    { icon: "download", title: "保存・共有", desc: "各カードのプレビュー下のボタンで、すぐに保存・コピー・共有できます。下の「保存・共有」でまとめて保存もできます。" },
    { icon: "save", title: "あとで続ける", desc: "内容はこの端末に自動保存されます。別の端末で続けるには、右上の⋮メニューの「作業をファイル保存」「作業ファイルを開く」を使います。" },
    { icon: "palette", title: "テーマ・言語", desc: "右上で4種類のテーマカラーと言語を切り替えられます。" },
  ],
  zh: [
    { icon: "search", title: "第1步 — 选书", desc: "按书名或作者搜索并选择书籍。也可以用封面照片搜索，找不到时可以手动输入。" },
    { icon: "theater_comedy", title: "第2步 — 书卡", desc: "如果书变成一个角色会是什么样子？想象它的名字、喜好和口头禅，并画出来吧。" },
    { icon: "campaign", title: "第3步 — 介绍卡", desc: "写一段推荐语给还没读过的朋友，还可以加上推荐星级和图片。" },
    { icon: "help_center", title: "第4步 — 问题卡", desc: "写下阅读时想到的问题。可以点击问题灵感开始。未填写的答案不会显示在卡片上。" },
    { icon: "download", title: "保存与分享", desc: "在每张卡片预览下方即可保存、复制或分享图片，也可以在底部「保存与分享」一次保存多张。" },
    { icon: "save", title: "稍后继续", desc: "内容会自动保存在本设备。如需在其他设备继续，请使用右上角⋮菜单中的「保存为文件」和「打开作品文件」。" },
    { icon: "palette", title: "主题和语言", desc: "在右上角选择4种主题颜色和语言。" },
  ],
};

export default function HelpModal() {
  const lang = useAppStore((s) => s.lang);
  const content = helpContent[lang] ?? helpContent.ko;

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger className="icon-btn" aria-label={t("howToUse", lang)}>
            <Icon name="help_outline" size={20} />
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent className="hidden sm:block">{t("howToUse", lang)}</TooltipContent>
      </Tooltip>

      <DialogContent className="w-[calc(100vw-2rem)] max-w-lg max-h-[85vh] p-0 gap-0 rounded-3xl overflow-hidden flex flex-col bg-card">
        <DialogHeader className="p-5 border-b border-border text-left">
          <DialogTitle className="text-xl flex items-center gap-2">📚 {t("howToUse", lang)}</DialogTitle>
          <DialogDescription className="text-xs">{t("footer", lang)}</DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 min-h-0 p-4 sm:p-5 space-y-2.5">
          {content.map((item) => (
            <div key={item.title} className="flex gap-3 p-3.5 rounded-2xl bg-secondary/60">
              <span className="w-9 h-9 rounded-full bg-card flex items-center justify-center text-primary-strong shrink-0">
                <Icon name={item.icon} size={20} />
              </span>
              <div className="min-w-0">
                <p className="font-bold text-[15px] mb-0.5">{item.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
          <a
            href="https://litt.ly/chichiboo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-primary/15 border border-primary/30 text-sm font-bold text-primary-strong hover:bg-primary/25 transition-colors"
          >
            <Icon name="mail" size={18} />
            {t("needHelp", lang)}
            <Icon name="arrow_forward" size={16} />
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
