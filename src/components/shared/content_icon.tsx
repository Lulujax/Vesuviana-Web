import {
  BadgeCheck,
  Clock3,
  FlaskConical,
  GraduationCap,
  Headphones,
  HeartHandshake,
  Leaf,
  MapPin,
  MessageCircle,
  Percent,
  ShieldCheck,
  Sparkles,
  Sprout,
  Truck
} from "lucide-react";
import type { IconKey } from "@/core/types/vesuviana_content_types";

const icon_registry = {
  truck: Truck,
  headset: Headphones,
  sprout: Sprout,
  shield: ShieldCheck,
  flask: FlaskConical,
  leaf: Leaf,
  badge: BadgeCheck,
  heart: HeartHandshake,
  percent: Percent,
  graduation: GraduationCap,
  sparkles: Sparkles,
  map: MapPin,
  message: MessageCircle,
  clock: Clock3
} as const;

export function ContentIcon({ icon_key, className }: { icon_key: IconKey; className?: string }) {
  const IconComponent = icon_registry[icon_key];
  return <IconComponent className={className} aria-hidden="true" />;
}
