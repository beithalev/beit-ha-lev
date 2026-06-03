import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Beit Ha Lev | בֵּית הַלֵּב",
  description: "A home for the heart — hevruta Torah study and shidduch connections.",
  openGraph: {
    title: "Beit Ha Lev",
    description: "Live Torah study rooms and meaningful shidduch connections.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Navbar />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
