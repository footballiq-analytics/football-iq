import type { Metadata } from "next";
import "./globals.css";
import { BottomNav, Footer, Header } from "@/components/site-shell";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: { default: "FUTBOL IQ — Strateji. Bilgi. Tutku.", template: "%s | FUTBOL IQ" },
  description: "Gerçek futbol performanslarından beslenen, özgün fantasy football deneyimi. Takımını kur, liglere katıl, puanını yükselt.",
  openGraph: {
    title: "FUTBOL IQ — Fantasy Football",
    description: "Takımını kur, gerçek performanslardan puan kazan, arkadaşlarınla ve genel sıralamada yarış.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "FUTBOL IQ",
    description: "Web tabanlı özgün fantasy football platformu.",
    inLanguage: "tr-TR",
  };

  return (
    <html lang="tr" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <BottomNav />
        </ThemeProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </body>
    </html>
  );
}
