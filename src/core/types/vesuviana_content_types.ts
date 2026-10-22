export type IconKey =
  | "truck"
  | "headset"
  | "sprout"
  | "shield"
  | "flask"
  | "leaf"
  | "badge"
  | "heart"
  | "percent"
  | "graduation"
  | "sparkles"
  | "map"
  | "message"
  | "clock";

export interface ValuePillarContent {
  pillar_id: string;
  icon_key: IconKey;
  title: string;
  description: string;
}

export interface StoryValueContent {
  value_id: string;
  icon_key: IconKey;
  title: string;
  description: string;
}

export interface TestimonialContent {
  testimonial_id: string;
  customer_name: string;
  customer_city: string;
  brand_name: string;
  message: string;
  timestamp_label: string;
  initials: string;
}

export interface WholesaleBenefitContent {
  benefit_id: string;
  icon_key: IconKey;
  title: string;
  description: string;
}

export interface SocialLinkContent {
  social_id: string;
  network_name: string;
  url: string;
}

export interface NavigationLinkContent {
  link_id: string;
  label: string;
  href: string;
}

export interface ContactContent {
  whatsapp_number: string;
  email: string;
  address: string;
  schedule: string;
}
