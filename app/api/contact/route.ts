import { NextResponse } from "next/server";
import { validateContact, type ContactPayload } from "@/lib/contactValidation";

/**
 * Contact form delivery via the Resend HTTP API (no SDK dependency).
 *
 * Required environment variables (see .env.example):
 *   RESEND_API_KEY      — API key from https://resend.com
 *   CONTACT_TO_EMAIL    — inbox that receives messages
 * Optional:
 *   CONTACT_FROM_EMAIL  — verified sender, defaults to Resend's onboarding sender
 *
 * When not configured the route answers 503 { error: "not_configured" } and
 * the client offers a pre-filled mailto: fallback instead.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
// Best-effort, per-instance rate limit (serverless instances don't share memory)
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] as string);

export async function POST(request: Request) {
  let body: Partial<ContactPayload>;
  try {
    body = (await request.json()) as Partial<ContactPayload>;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { data, errors } = validateContact(body);

  // Honeypot filled → pretend success, drop silently
  if (data.company) return NextResponse.json({ ok: true });

  if (Object.keys(errors).length) return NextResponse.json({ error: "Validation failed.", errors }, { status: 400 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many messages — please try again later." }, { status: 429 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const from = process.env.CONTACT_FROM_EMAIL || "SASHIKA OS <onboarding@resend.dev>";

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: data.email,
        subject: `Portfolio message from ${data.name}`,
        text: `${data.message}\n\n— ${data.name} <${data.email}>`,
        html: `<p>${escapeHtml(data.message).replace(/\n/g, "<br/>")}</p><p>— ${escapeHtml(data.name)} &lt;${escapeHtml(data.email)}&gt;</p>`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      return NextResponse.json({ error: "The email service rejected the message." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not reach the email service." }, { status: 502 });
  }
}
