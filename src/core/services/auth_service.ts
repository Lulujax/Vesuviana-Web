import type { AdminUser } from "@/core/types/vesuviana_domain_types";

const to_hex = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map((byte_value) => byte_value.toString(16).padStart(2, "0"))
    .join("");

export function generate_password_salt(): string {
  const random_bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(random_bytes)
    .map((byte_value) => byte_value.toString(16).padStart(2, "0"))
    .join("");
}

export async function hash_password(password: string, salt: string): Promise<string> {
  const encoded_value = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", encoded_value);
  return to_hex(digest);
}

export async function verify_password(user: AdminUser, password: string): Promise<boolean> {
  const candidate_hash = await hash_password(password, user.password_salt);
  return candidate_hash === user.password_hash;
}
