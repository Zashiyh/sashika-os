/** Shared contact form validation — used by the client form and the API route. */

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  /** Honeypot — must stay empty */
  company?: string;
}

export type ContactErrors = Partial<Record<"name" | "email" | "message", string>>;

export const CONTACT_LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 120 },
  message: { min: 10, max: 2000 },
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(input: Partial<ContactPayload>): { data: ContactPayload; errors: ContactErrors } {
  const data: ContactPayload = {
    name: String(input.name ?? "").trim(),
    email: String(input.email ?? "").trim(),
    message: String(input.message ?? "").trim(),
    company: String(input.company ?? "").trim(),
  };
  const errors: ContactErrors = {};

  if (data.name.length < CONTACT_LIMITS.name.min) errors.name = "Please enter your name.";
  else if (data.name.length > CONTACT_LIMITS.name.max) errors.name = `Name must be under ${CONTACT_LIMITS.name.max} characters.`;

  if (!EMAIL_PATTERN.test(data.email)) errors.email = "Please enter a valid email address.";
  else if (data.email.length > CONTACT_LIMITS.email.max) errors.email = "Email address is too long.";

  if (data.message.length < CONTACT_LIMITS.message.min)
    errors.message = `Message should be at least ${CONTACT_LIMITS.message.min} characters.`;
  else if (data.message.length > CONTACT_LIMITS.message.max)
    errors.message = `Message must be under ${CONTACT_LIMITS.message.max} characters.`;

  return { data, errors };
}

export function buildMailto(to: string, payload: Pick<ContactPayload, "name" | "email" | "message">): string {
  const subject = `Portfolio enquiry from ${payload.name || "a visitor"}`;
  const body = `${payload.message}\n\n— ${payload.name}${payload.email ? ` (${payload.email})` : ""}`;
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
