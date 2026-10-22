export function get_whatsapp_digits(phone_number: string): string {
  return phone_number.replace(/\D/g, "");
}

export function normalize_venezuelan_phone(phone_number: string): string {
  const digits = get_whatsapp_digits(phone_number);
  if (!digits) {
    return "";
  }
  if (digits.startsWith("58")) {
    return digits;
  }
  if (digits.startsWith("0")) {
    return `58${digits.slice(1)}`;
  }
  return `58${digits}`;
}

export function is_valid_whatsapp_number(phone_number: string): boolean {
  const normalized_digits = normalize_venezuelan_phone(phone_number);
  return normalized_digits.length >= 11 && normalized_digits.length <= 13;
}

export function build_whatsapp_url(phone_number: string, message: string): string {
  const normalized_digits = normalize_venezuelan_phone(phone_number);
  return `https://wa.me/${normalized_digits}?text=${encodeURIComponent(message)}`;
}

export function format_whatsapp_display(phone_number: string): string {
  const normalized_digits = normalize_venezuelan_phone(phone_number);
  if (!normalized_digits) {
    return phone_number;
  }
  const local_digits = normalized_digits.startsWith("58") ? normalized_digits.slice(2) : normalized_digits;
  if (local_digits.length === 10) {
    return `+58 ${local_digits.slice(0, 3)} ${local_digits.slice(3, 6)} ${local_digits.slice(6)}`;
  }
  return `+${normalized_digits}`;
}
