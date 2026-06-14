import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
  weight: ["700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "WoW Explorador",
  description: "Panel semanal y seguimiento de personajes de World of Warcraft — Quel'Thalas US",
  keywords: ["World of Warcraft", "Mythic+", "Raider.io", "Quel'Thalas", "Horda"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${cinzel.variable} ${inter.variable}`}>
      <body className="min-h-dvh flex flex-col bg-bg text-bone font-inter antialiased">
        <Header />
        <main className="flex-1 pt-[72px]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
