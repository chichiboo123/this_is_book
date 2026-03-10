import { useRef } from "react";
import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";

export default function IntroCardActivity() {
  const { lang, introText, setIntroText, introImageUrl, setIntroImageUrl, selectedBook, customTitle, setCustomTitle } = useAppStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setIntroImageUrl(reader.result as string);
    reader.readAsDataURL(file);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      <h2 className="section-title">{t("introCardTitle", lang)}</h2>
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
      <p className="text-sm text-foreground">{t("introText", lang)}</p>
      <textarea
        className="textarea-cute w-full min-h-[160px]"
        placeholder={t("introPlaceholder", lang)}
        value={introText}
        onChange={(e) => setIntroText(e.target.value)}
      />

      {/* Image upload */}
      <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      {introImageUrl ? (
        <div className="space-y-2 border-2 border-primary/20 rounded-xl p-3 bg-card/50">
          <img
            src={introImageUrl}
            alt="intro"
            className="w-full max-h-48 object-contain rounded-lg"
          />
          <div className="flex gap-2">
            <button onClick={() => fileRef.current?.click()} className="btn-outline-cute flex-1 py-1.5 text-xs">
              📷 변경
            </button>
            <button onClick={() => setIntroImageUrl(null)} className="btn-outline-cute border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground py-1.5 px-3">
              ❌
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => fileRef.current?.click()} className="btn-outline-cute w-full text-sm">
          📷 {t("uploadImage", lang)}
        </button>
      )}
    </div>
  );
}
