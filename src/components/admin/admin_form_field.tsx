import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AdminFormFieldProps {
  label: string;
  html_for: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function AdminFormField({ label, html_for, error, hint, required, children, className }: AdminFormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={html_for} className="flex items-center gap-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink">
        {label}
        {required ? <span className="text-gold-deep">*</span> : null}
      </label>
      {children}
      {error ? <p className="text-[0.72rem] leading-relaxed text-danger">{error}</p> : null}
      {!error && hint ? <p className="text-[0.7rem] leading-relaxed text-stone/75">{hint}</p> : null}
    </div>
  );
}
