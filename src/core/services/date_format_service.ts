export function format_audit_timestamp(iso_value: string): string {
  const parsed_date = new Date(iso_value);
  return new Intl.DateTimeFormat("es-VE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(parsed_date);
}

export function format_short_date(iso_value: string): string {
  const parsed_date = new Date(iso_value);
  return new Intl.DateTimeFormat("es-VE", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(parsed_date);
}

export function get_relative_time_label(iso_value: string): string {
  const difference_in_seconds = Math.round((new Date(iso_value).getTime() - Date.now()) / 1000);
  const formatter = new Intl.RelativeTimeFormat("es", { numeric: "auto" });
  const ranges: Array<{ limit: number; divisor: number; unit: Intl.RelativeTimeFormatUnit }> = [
    { limit: 60, divisor: 1, unit: "second" },
    { limit: 3600, divisor: 60, unit: "minute" },
    { limit: 86400, divisor: 3600, unit: "hour" },
    { limit: 604800, divisor: 86400, unit: "day" },
    { limit: 2629800, divisor: 604800, unit: "week" },
    { limit: 31557600, divisor: 2629800, unit: "month" },
    { limit: Number.POSITIVE_INFINITY, divisor: 31557600, unit: "year" }
  ];
  const range = ranges.find((current_range) => Math.abs(difference_in_seconds) < current_range.limit) ?? ranges[ranges.length - 1];
  return formatter.format(Math.round(difference_in_seconds / range.divisor), range.unit);
}
