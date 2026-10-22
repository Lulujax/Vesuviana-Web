import { useEffect, useState } from "react";

export function use_media_query(query: string): boolean {
  const [matches, set_matches] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media_query = window.matchMedia(query);
    const handle_change = (event: MediaQueryListEvent) => set_matches(event.matches);
    set_matches(media_query.matches);
    media_query.addEventListener("change", handle_change);
    return () => media_query.removeEventListener("change", handle_change);
  }, [query]);

  return matches;
}

export function use_prefers_reduced_motion(): boolean {
  return use_media_query("(prefers-reduced-motion: reduce)");
}

export function use_scrolled(threshold = 24): boolean {
  const [is_scrolled, set_is_scrolled] = useState(false);
  useEffect(() => {
    const handle_scroll = () => set_is_scrolled(window.scrollY > threshold);
    handle_scroll();
    window.addEventListener("scroll", handle_scroll, { passive: true });
    return () => window.removeEventListener("scroll", handle_scroll);
  }, [threshold]);
  return is_scrolled;
}
