import type { Metadata } from "next";
import Background from "@/components/Background/Background";
import HyperspeedBackground from "@/components/HyperspeedBackground/HyperspeedBackground";
import Navbar from "@/components/Navbar/Navbar";
import Particles from "@/components/Particles/Particles";
import ScrollProgress from "@/components/ScrollProgress/ScrollProgress";
import "./classic.css";

export const metadata: Metadata = {
  title: "Classic portfolio",
  description: "The original single-page version of Sashika Madushan's portfolio.",
};

/** The original single-page portfolio, preserved at /classic. */
export default function ClassicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-white overflow-x-hidden">
      <HyperspeedBackground />
      <Background />
      <Navbar />
      <Particles />
      <ScrollProgress />
      {children}
      {/* Plain anchor (full reload) keeps classic global CSS out of the OS */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- intentional full reload */}
      <a href="/" className="classic-os-link">
        Launch SASHIKA OS →
      </a>
    </div>
  );
}
