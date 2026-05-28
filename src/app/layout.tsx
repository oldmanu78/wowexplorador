// Layout raíz de WoW Explorer
// Configura las fuentes Cinzel (títulos) y Exo 2 (cuerpo), el tema Horda y el layout global
import type { Metadata } from "next";
import { Cinzel, Exo_2 } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

// Fuente Cinzel para títulos (serif, estilo épico Warcraft)
const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

// Fuente Exo 2 para cuerpo de texto (sans-serif, legible)
const exo2 = Exo_2({
  subsets: ["latin"],
  variable: "--font-exo",
  display: "swap",
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
    // Aplico las variables de fuentes al HTML para que estén disponibles globalmente
    <html lang="es" className={`${cinzel.variable} ${exo2.variable}`}>
      <body className="min-h-dvh flex flex-col bg-horda-bg text-horda-text font-exo antialiased">
        <Header />
        {/* Padding-top para compensar el header fijo (h-16 = 4rem) */}
        <main className="flex-1 pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
