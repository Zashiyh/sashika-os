"use client";

import { AlertTriangle, Check, CheckCircle2, Copy, Globe, Loader2, Mail, MapPin, Send } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { useState, type FormEvent } from "react";
import { profile, socialLinks, type SocialLink } from "@/data/portfolio";
import { buildMailto, CONTACT_LIMITS, validateContact, type ContactErrors } from "@/lib/contactValidation";
import { useAudio } from "../AudioController";
import { GithubIcon, LinkedinIcon } from "../ui/BrandIcons";
import { AppShell, ExternalLink, SectionTitle } from "./shared";

const socialIcons: Record<SocialLink["id"], ComponentType<SVGProps<SVGSVGElement>>> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  portfolio: Globe,
  email: Mail,
};

type Status =
  | { type: "idle" }
  | { type: "sending" }
  | { type: "sent" }
  | { type: "unavailable"; mailto: string }
  | { type: "error"; message: string; mailto: string };

export default function ContactWindow() {
  const { play } = useAudio();
  const [form, setForm] = useState({ name: "", email: "", message: "", company: "" });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [copied, setCopied] = useState(false);

  const update = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    if (errors[field as keyof ContactErrors]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      play("click");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const { data, errors: found } = validateContact(form);
    setErrors(found);
    if (Object.keys(found).length) {
      play("error");
      const first = Object.keys(found)[0];
      document.getElementById(`contact-${first}`)?.focus();
      return;
    }
    const mailto = buildMailto(profile.email, data);
    setStatus({ type: "sending" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = (await response.json().catch(() => ({}))) as { error?: string; errors?: ContactErrors };
      if (response.ok) {
        setStatus({ type: "sent" });
        setForm({ name: "", email: "", message: "", company: "" });
        play("granted");
      } else if (response.status === 503 && result.error === "not_configured") {
        setStatus({ type: "unavailable", mailto });
      } else if (response.status === 400 && result.errors) {
        setErrors(result.errors);
        setStatus({ type: "idle" });
        play("error");
      } else {
        setStatus({ type: "error", message: result.error ?? "Something went wrong while sending.", mailto });
        play("error");
      }
    } catch {
      setStatus({ type: "error", message: "Network error — your message wasn't sent.", mailto });
      play("error");
    }
  };

  const fieldError = (field: keyof ContactErrors) =>
    errors[field] ? (
      <p id={`contact-${field}-error`} className="mt-1 text-xs text-red-500 cyber:text-red-300">
        {errors[field]}
      </p>
    ) : null;

  return (
    <AppShell>
      <div className="grid gap-6 @3xl:grid-cols-[1fr_1.2fr]">
        <section aria-labelledby="contact-heading">
          <p className="os-accent text-[11px] font-semibold uppercase tracking-[0.25em]">Contact</p>
          <h1 id="contact-heading" className="mt-1 font-display text-2xl font-semibold">
            Have an idea? Let&apos;s build it.
          </h1>
          <p className="os-muted mt-2 text-sm leading-relaxed">
            I&apos;m open to internships, software engineering opportunities, collaborations and interesting projects.
          </p>

          <div className="os-card mt-5 p-4">
            <p className="os-muted text-[11px] uppercase tracking-[0.2em]">Email</p>
            <p className="mt-1 break-all font-medium">{profile.email}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href={`mailto:${profile.email}`} className="os-btn os-btn-primary !min-h-9">
                <Mail className="size-4" aria-hidden /> Send email
              </a>
              <button type="button" onClick={copyEmail} className="os-btn !min-h-9" aria-live="polite">
                {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          <SectionTitle className="mt-5">Find me online</SectionTitle>
          <ul className="grid gap-2">
            {socialLinks
              .filter((link) => link.id !== "email")
              .map((link) => {
                const Icon = socialIcons[link.id];
                return (
                  <li key={link.id}>
                    <ExternalLink href={link.href} className="os-card os-card-interactive flex items-center gap-3 px-3 py-2.5">
                      <Icon className="os-accent size-4" aria-hidden="true" />
                      <span className="text-sm font-medium">{link.label}</span>
                      <span className="os-muted ml-auto truncate text-xs">{link.handle}</span>
                    </ExternalLink>
                  </li>
                );
              })}
          </ul>
          <p className="os-muted mt-4 flex items-center gap-1.5 text-xs">
            <MapPin className="size-3.5" aria-hidden /> {profile.location} · {profile.availability}
          </p>
        </section>

        <section aria-labelledby="contact-form-heading" className="os-card p-4 @lg:p-5">
          <h2 id="contact-form-heading" className="font-semibold">
            Send a message
          </h2>

          {status.type === "sent" ? (
            <div className="flex flex-col items-center py-10 text-center" role="status">
              <CheckCircle2 className="size-12 text-emerald-500" aria-hidden />
              <p className="mt-3 text-lg font-semibold">Message sent</p>
              <p className="os-muted mt-1 text-sm">Thanks for reaching out — I&apos;ll reply by email.</p>
              <button type="button" className="os-btn mt-5" onClick={() => setStatus({ type: "idle" })}>
                Send another
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={onSubmit} className="mt-4 space-y-3.5">
              <div>
                <label htmlFor="contact-name" className="mb-1 block text-sm font-medium">
                  Name
                </label>
                <input
                  id="contact-name"
                  className="os-input"
                  autoComplete="name"
                  value={form.name}
                  onChange={update("name")}
                  maxLength={CONTACT_LIMITS.name.max}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "contact-name-error" : undefined}
                  required
                />
                {fieldError("name")}
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-1 block text-sm font-medium">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  className="os-input"
                  autoComplete="email"
                  value={form.email}
                  onChange={update("email")}
                  maxLength={CONTACT_LIMITS.email.max}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "contact-email-error" : undefined}
                  required
                />
                {fieldError("email")}
              </div>
              <div>
                <label htmlFor="contact-message" className="mb-1 flex justify-between text-sm font-medium">
                  Message
                  <span className="os-muted text-xs font-normal">
                    {form.message.length}/{CONTACT_LIMITS.message.max}
                  </span>
                </label>
                <textarea
                  id="contact-message"
                  className="os-input min-h-32 resize-y"
                  value={form.message}
                  onChange={update("message")}
                  maxLength={CONTACT_LIMITS.message.max}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "contact-message-error" : undefined}
                  required
                />
                {fieldError("message")}
              </div>
              {/* Honeypot — hidden from people, tempting for bots */}
              <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor="contact-company">Company</label>
                <input id="contact-company" tabIndex={-1} autoComplete="off" value={form.company} onChange={update("company")} />
              </div>

              {(status.type === "unavailable" || status.type === "error") && (
                <div role="alert" className="flex gap-3 rounded-lg border border-amber-400/40 bg-amber-400/10 p-3 text-sm">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" aria-hidden />
                  <div>
                    <p>
                      {status.type === "unavailable"
                        ? "Direct delivery isn't set up on this deployment yet."
                        : status.message}{" "}
                      You can send the same message from your email app instead.
                    </p>
                    <a href={status.mailto} className="os-link mt-1 inline-block font-medium">
                      Open in email app →
                    </a>
                  </div>
                </div>
              )}

              <button type="submit" className="os-btn os-btn-primary w-full" disabled={status.type === "sending"}>
                {status.type === "sending" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Send className="size-4" aria-hidden />}
                {status.type === "sending" ? "Sending…" : "Send message"}
              </button>
              <p className="os-muted text-[11px]">Your details are only used to reply to your message.</p>
            </form>
          )}
        </section>
      </div>
    </AppShell>
  );
}
