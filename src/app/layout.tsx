import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";
import FloatingActions from "@/components/FloatingActions";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "FONUS CEBU | Federation Cooperative",
  description: "The most trusted funeral and memorial provider in our country. Providing decent and affordable memorial services in Cebu since 2009.",
  openGraph: {
    title: "FONUS CEBU | Federation Cooperative",
    description: "The most trusted funeral and memorial provider in our country.",
    url: "https://fonuscebu.com",
    siteName: "FONUS CEBU",
    images: [
      {
        url: "/fonus.webp",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_PH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FONUS CEBU | Federation Cooperative",
    description: "The most trusted funeral and memorial provider in our country.",
    images: ["/fonus.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="brown" className="scroll-smooth">
      <body
        className={`${manrope.variable} ${playfair.variable} antialiased min-h-screen flex flex-col font-sans`}
      >
        <LanguageProvider>
          {children}
          <FloatingActions />
        </LanguageProvider>
      </body>
    </html>
  );
}
