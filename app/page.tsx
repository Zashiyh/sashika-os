import SashikaOS from "@/components/os/SashikaOS";
import { PortfolioStatic } from "@/components/os/PortfolioStatic";
import { getSocial, profile } from "@/data/portfolio";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  email: `mailto:${profile.email}`,
  address: { "@type": "PostalAddress", addressCountry: "LK" },
  url: getSocial("portfolio").href,
  sameAs: [getSocial("github").href, getSocial("linkedin").href],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <SashikaOS />
      {/* Full content for visitors without JavaScript */}
      <noscript>
        <PortfolioStatic />
      </noscript>
    </>
  );
}
