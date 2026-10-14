import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAppStore } from "@/lib/useAppStore";
import { t } from "@/lib/i18n";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  emoji?: string;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
}

/** 되돌릴 수 없는 작업 확인 — Esc·포커스 관리가 되는 Radix AlertDialog 기반 */
export default function ConfirmDialog({
  open,
  onOpenChange,
  emoji = "⚠️",
  title,
  description,
  confirmLabel,
  onConfirm,
}: ConfirmDialogProps) {
  const lang = useAppStore((s) => s.lang);
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[calc(100vw-2rem)] max-w-sm rounded-3xl p-6">
        <AlertDialogHeader className="items-center text-center space-y-2">
          <span className="text-4xl" aria-hidden="true">{emoji}</span>
          <AlertDialogTitle className="text-lg font-bold font-body">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-sm leading-relaxed text-center">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row gap-2 sm:space-x-0 pt-2">
          <AlertDialogCancel className="flex-1 mt-0 h-11 rounded-full font-bold">
            {t("cancel", lang)}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="flex-1 h-11 rounded-full font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
