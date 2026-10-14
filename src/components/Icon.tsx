import { cn } from "@/lib/utils";

interface IconProps {
  /** Google Material Icons(Outlined) 이름 — https://fonts.google.com/icons */
  name: string;
  size?: number;
  className?: string;
}

/** 치수쌤 웹앱 표준 아이콘 (Material Icons Outlined) */
export default function Icon({ name, size = 20, className }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("material-icons-outlined shrink-0", className)}
      style={{ fontSize: size, width: size, height: size, overflow: "hidden" }}
    >
      {name}
    </span>
  );
}
