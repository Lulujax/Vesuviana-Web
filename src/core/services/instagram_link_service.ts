export function normalize_instagram_link(value: string): string | null {
  const trimmed_value = value.trim();
  if (!trimmed_value) {
    return null;
  }
  if (/^https?:\/\//i.test(trimmed_value)) {
    try {
      const parsed_url = new URL(trimmed_value);
      if (!parsed_url.hostname.toLowerCase().includes("instagram.com")) {
        return null;
      }
      return parsed_url.toString();
    } catch {
      return null;
    }
  }
  const without_prefix = trimmed_value
    .replace(/^https?:\/\//i, "")
    .replace(/^(www\.)?instagram\.com\//i, "")
    .replace(/^@/, "")
    .replace(/\/+$/, "");
  if (!/^[A-Za-z0-9._]{1,40}$/.test(without_prefix)) {
    return null;
  }
  return `https://instagram.com/${without_prefix}`;
}

export function is_valid_instagram_source(value: string): boolean {
  return value.trim().length === 0 || normalize_instagram_link(value) !== null;
}

export function get_instagram_display_label(value: string): string {
  const normalized_link = normalize_instagram_link(value);
  if (!normalized_link) {
    return "";
  }
  const handle = normalized_link
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
    .replace(/\/+$/, "");
  return `@${handle}`;
}
