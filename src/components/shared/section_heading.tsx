import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  theme?: "light" | "dark";
  className?: string;
  title_className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  theme = "dark",
  className,
  title_className
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow ? (
        <div className={cn("flex items-center gap-3", align === "center" && "justify-center")}>
          <span className="h-px w-8 bg-gold" />
          <span className={cn("label-caps", theme === "light" ? "text-gold-bright" : "text-gold-deep")}>{eyebrow}</span>
        </div>
      ) : null}
      <h2
        className={cn(
          "max-w-3xl text-balance text-display-section",
          theme === "light" ? "text-cream" : "text-ink",
          title_className
        )}
      >
        {title}
      </h2>
      {description ? (
        <div
          className={cn(
            "max-w-2xl text-pretty text-sm leading-relaxed sm:text-base",
            theme === "light" ? "text-cream/65" : "text-stone"
          )}
        >
          {description}
        </div>
      ) : null}
    </div>
  );
}
