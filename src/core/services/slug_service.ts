export function slugify_text(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export function create_unique_slug(base_value: string, existing_slugs: string[], fallback_prefix = "item"): string {
  const base_slug = slugify_text(base_value) || fallback_prefix;
  let candidate_slug = base_slug;
  let counter = 2;
  while (existing_slugs.includes(candidate_slug)) {
    candidate_slug = `${base_slug}-${counter}`;
    counter += 1;
  }
  return candidate_slug;
}
