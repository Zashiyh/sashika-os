"use client";

import { Award, ExternalLink as ExternalIcon, FileBadge2, Trophy } from "lucide-react";
import Image from "next/image";
import { achievements, certificates } from "@/data/portfolio";
import { AppShell, EmptyState, ExternalLink, SectionTitle } from "./shared";

/** Genuine certificates and achievements only (see data/portfolio.ts). */
export default function CertificatesApp() {
  return (
    <AppShell>
      <header className="mb-5">
        <p className="os-accent text-[11px] font-semibold uppercase tracking-[0.25em]">Certificates</p>
        <h1 className="mt-1 font-display text-2xl font-semibold">Certificates & achievements</h1>
      </header>

      <SectionTitle icon={FileBadge2}>Certificates</SectionTitle>
      {certificates.length > 0 ? (
        <ul className="grid gap-3 @xl:grid-cols-2">
          {certificates.map((cert) => (
            <li key={cert.title} className="os-card overflow-hidden">
              {cert.image && (
                <div className="relative aspect-[4/3] w-full">
                  <Image src={cert.image} alt={`${cert.title} certificate`} fill sizes="320px" className="object-cover" />
                </div>
              )}
              <div className="p-4">
                <p className="font-semibold">{cert.title}</p>
                <p className="os-muted text-sm">
                  {cert.issuer}
                  {cert.date ? ` · ${cert.date}` : ""}
                </p>
                {cert.credentialUrl && (
                  <ExternalLink href={cert.credentialUrl} className="os-link mt-2 inline-flex items-center gap-1 text-sm">
                    Verify credential <ExternalIcon className="size-3.5" aria-hidden />
                  </ExternalLink>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState icon={Award} title="No certificates added yet">
          Verified certificates will appear here once they&apos;re published.
        </EmptyState>
      )}

      <SectionTitle icon={Trophy} className="mt-6">
        Achievements
      </SectionTitle>
      <ul className="space-y-3">
        {achievements.map((item) => (
          <li key={item.title} className="os-card flex items-start gap-3 p-4">
            <Trophy className="os-accent mt-0.5 size-5 shrink-0" aria-hidden />
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="os-muted text-sm">
                {item.issuer} — {item.description}
              </p>
              {item.url && (
                <ExternalLink href={item.url} className="os-link mt-1 inline-flex items-center gap-1 text-sm">
                  View on GitHub <ExternalIcon className="size-3.5" aria-hidden />
                </ExternalLink>
              )}
            </div>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
