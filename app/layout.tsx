import type { Metadata } from "next";
import "./globals.css";
import "./fantasy.css";
import "./pro-team.css";
import "./form-colors.css";
import { BottomNav, Footer, Header } from "@/components/site-shell";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: { default: "FUTBOL IQ Fantasy", template: "%s | FUTBOL IQ Fantasy" },
  description: "Türkiye odaklı, mobil uyumlu fantasy football deneyimi. Kadronu kur, bütçeni yönet ve liglerde yarış.",
  openGraph: {
    title: "FUTBOL IQ Fantasy",
    description: "Kadronu kur, bütçeni yönet ve fantasy liglerinde yarış.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "FUTBOL IQ Fantasy",
    description: "Web tabanlı fantasy football platformu.",
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
