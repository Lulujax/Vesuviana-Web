import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon: IconComponent, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-sand/30 px-6 py-14 text-center",
        className
      )}
    >
      <span className="mb-5 flex size-14 items-center justify-center rounded-full border border-gold/25 bg-cream text-gold-deep">
        <IconComponent className="size-6" />
      </span>
      <h3 className="font-display text-2xl text-ink">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-stone">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
