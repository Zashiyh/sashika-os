import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { profile } from "@/data/portfolio";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://sashikaportfolio.vercel.app"),
  title: {
    default: `${profile.name} | SASHIKA OS — Software Engineer Portfolio`,
    template: `%s | ${profile.name}`,
  },
  description: `${profile.name} — ${profile.role} from ${profile.location}. Explore projects, skills and contact details inside SASHIKA OS, an interactive 3D cyber operating system portfolio.`,
  keywords: ["Sashika Madushan", "Software Engineer", "Full Stack Developer", "Next.js", "React", "Portfolio", "Sri Lanka"],
  authors: [{ name: profile.name, url: "https://github.com/Zashiyh" }],
  openGraph: {
    type: "website",
    title: `${profile.name} — SASHIKA OS`,
    description: profile.shortIntro,
    url: "https://sashikaportfolio.vercel.app",
    siteName: "SASHIKA OS",
  },
  twitter: { card: "summary_large_image", title: `${profile.name} — SASHIKA OS`, description: profile.shortIntro },
};

export const viewport: Viewport = {
  themeColor: "#02040a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
