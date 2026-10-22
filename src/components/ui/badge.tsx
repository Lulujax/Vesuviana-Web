import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badge_variants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold tracking-[0.08em] uppercase transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-ink text-cream",
        secondary: "border-transparent bg-sand text-ink",
        outline: "border-ink/15 bg-transparent text-ink",
        gold: "border-gold/30 bg-gold/10 text-gold-deep",
        success: "border-success/20 bg-success/10 text-success",
        danger: "border-danger/20 bg-danger/10 text-danger",
        dark: "border-cream/15 bg-cream/10 text-cream"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badge_variants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badge_variants({ variant }), className)} {...props} />;
}

export { Badge, badge_variants };
