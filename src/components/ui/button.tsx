import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const button_variants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-[color,background-color,border-color,box-shadow,transform] duration-200 outline-none focus-visible:ring-2 focus-visible:ring-gold-deep focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-ink text-cream shadow-[0_12px_30px_-18px_rgba(20,19,18,0.7)] hover:bg-ink/90",
        secondary: "bg-sand text-ink hover:bg-sand/80",
        outline: "border border-ink/20 bg-transparent text-ink hover:border-ink/50 hover:bg-ink/5",
        ghost: "bg-transparent text-ink hover:bg-ink/5",
        destructive: "bg-danger text-white hover:bg-danger/90",
        link: "rounded-none bg-transparent p-0 text-ink underline-offset-4 hover:underline",
        gold: "bg-gold-bright text-ink shadow-[0_12px_30px_-18px_rgba(181,137,56,0.8)] hover:bg-gold-bright/90",
        outline_light: "border border-cream/30 bg-cream/5 text-cream backdrop-blur-sm hover:border-cream/60 hover:bg-cream/10"
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-xs",
        lg: "h-13 px-8 text-[0.95rem]",
        icon: "size-11 p-0",
        icon_sm: "size-9 p-0"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button_variants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot : "button";
    return <Component className={cn(button_variants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, button_variants };
