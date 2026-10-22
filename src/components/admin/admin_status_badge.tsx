import { cn } from "@/lib/utils";

interface AdminStatusBadgeProps {
  label: string;
  tone?: "active" | "inactive" | "danger" | "role" | "neutral" | "gold";
  className?: string;
}

export function AdminStatusBadge({ label, tone = "neutral", className }: AdminStatusBadgeProps) {
  const tone_classes = {
    active: "border-success/25 bg-success/10 text-success",
    inactive: "border-line bg-sand/70 text-stone",
    danger: "border-danger/25 bg-danger/10 text-danger",
    role: "border-gold/35 bg-gold/10 text-gold-deep",
    neutral: "border-ink/10 bg-ink/5 text-stone",
    gold: "border-gold-bright/40 bg-gold-bright/15 text-gold-deep"
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.1em]",
        tone_classes[tone],
        className
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
