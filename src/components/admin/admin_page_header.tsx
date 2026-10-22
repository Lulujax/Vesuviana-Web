import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AdminPageHeaderProps {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function AdminPageHeader({ eyebrow, title, description, action, className }: AdminPageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-5 border-b border-line pb-7 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div>
        {eyebrow ? <p className="label-caps text-[0.55rem] text-gold-deep">{eyebrow}</p> : null}
        <h1 className="mt-2 font-display text-4xl leading-none tracking-tight text-ink sm:text-5xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone">{description}</p>
      </div>
      {action ? <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div> : null}
    </div>
  );
}
