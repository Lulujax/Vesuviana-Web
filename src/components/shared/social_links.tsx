import { FacebookIcon, InstagramIcon, TikTokIcon, YouTubeIcon } from "@/components/brand/social_icons";
import { CORPORATE_SOCIAL_LINKS } from "@/core/data/vesuviana_landing_content";
import { cn } from "@/lib/utils";

interface SocialLinksProps {
  theme?: "light" | "dark";
  show_labels?: boolean;
  className?: string;
  icon_className?: string;
}

const social_icon_components = {
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
  TikTok: TikTokIcon,
  YouTube: YouTubeIcon
} as const;

export function SocialLinks({
  theme = "dark",
  show_labels = false,
  className,
  icon_className
}: SocialLinksProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {CORPORATE_SOCIAL_LINKS.map((social_item) => {
        const IconComponent =
          social_icon_components[social_item.network_name as keyof typeof social_icon_components] || InstagramIcon;
        return (
          <a
            key={social_item.social_id}
            href={social_item.url}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`Visitar ${social_item.network_name} de Vesuviana Cosmetics`}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-bright",
              theme === "light"
                ? "border-cream/20 text-cream/75 hover:border-gold-bright/60 hover:text-gold-bright"
                : "border-ink/15 text-stone hover:border-gold/60 hover:text-gold-deep",
              show_labels ? "px-3 py-2 text-xs" : "size-9 justify-center",
              className
            )}
          >
            <IconComponent className={cn("size-4", icon_className)} />
            {show_labels ? <span>{social_item.network_name}</span> : null}
          </a>
        );
      })}
    </div>
  );
}
