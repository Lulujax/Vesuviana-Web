export function normalize_text_for_search(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function build_slug(value: string): string {
  return normalize_text_for_search(value).replace(/[\s']+/g, "-").replace(/-+/g, "-");
}

export function format_cop_amount(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function build_initials(full_name: string): string {
  const name_parts = full_name
    .trim()
    .split(/\s+/)
    .filter((name_part) => name_part.length > 0);
  if (name_parts.length === 0) {
    return "VA";
  }
  const first_initial = name_parts[0].charAt(0);
  const second_initial = name_parts.length > 1 ? name_parts[name_parts.length - 1].charAt(0) : "";
  return `${first_initial}${second_initial}`.toUpperCase();
}
