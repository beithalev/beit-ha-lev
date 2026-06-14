import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://beit-ha-lev-ten.vercel.app"),
  title: {
    default: "Beit Ha Lev | בֵּית הַלֵּב",
    template: "%s | Beit Ha Lev",
  },
  description: "A home for the heart — live Torah study rooms and values-first shidduch connections for Jews of every denomination.",
  keywords: ["Torah study", "shidduch", "hevruta", "Jewish learning", "live classes", "Jewish matchmaking", "Beit Ha Lev"],
  robots: { index: true, follow: true },
  openGraph: {
    title: "Beit Ha Lev",
    description: "Live Torah study rooms and meaningful shidduch connections.",
    url: "https://beit-ha-lev-ten.vercel.app",
    siteName: "Beit Ha Lev",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Beit Ha Lev",
    description: "Live Torah study rooms and meaningful shidduch connections.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-navy-950 text-cream-50 antialiased">
        <Navbar />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
