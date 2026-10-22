import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface VesuvianaLogoProps {
  theme?: "light" | "dark";
  show_tagline?: boolean;
  link_to?: string;
  compact?: boolean;
  className?: string;
}

export function VesuvianaLogo({
  theme = "dark",
  show_tagline = true,
  link_to = "/",
  compact = false,
  className
}: VesuvianaLogoProps) {
  const text_color = theme === "light" ? "text-cream" : "text-ink";
  const muted_color = theme === "light" ? "text-cream/60" : "text-stone";
  return (
    <Link
      to={link_to}
      className={cn("group inline-flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-bright focus-visible:ring-offset-4", className)}
      aria-label="Vesuviana Cosmetics, ir al inicio"
    >
      <svg
        viewBox="0 0 48 48"
        aria-hidden="true"
        className={cn("shrink-0 transition-transform duration-500 group-hover:rotate-[-4deg]", compact ? "size-8" : "size-10")}
      >
        <rect x="1" y="1" width="46" height="46" rx="12" fill={theme === "light" ? "#FAF6F0" : "#141312"} />
        <path d="M11 13h7l6.5 19L31 13h7L27.5 37h-7L11 13Z" fill={theme === "light" ? "#141312" : "#D4AF37"} />
        <path d="M33 9c3.7.7 6 3.6 6 7.5-3.8 0-6.6-3-6-7.5Z" fill={theme === "light" ? "#B58938" : "#FAF6F0"} />
      </svg>
      <span className="flex flex-col leading-none">
        <span className={cn("font-display text-[1.45rem] font-medium tracking-[0.01em]", text_color)}>Vesuviana</span>
        <span className={cn("label-caps mt-1 text-[0.55rem] tracking-[0.24em]", muted_color)}>Cosmetics</span>
        {show_tagline ? (
          <span className={cn("mt-1.5 text-[0.62rem] tracking-[0.08em]", muted_color)}>Belleza que nace del cuidado</span>
        ) : null}
      </span>
    </Link>
  );
}
