// Header principal con el emblema de la Horda, navegación y título
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// SVG del emblema de la Horda (versión simplificada, rojo y gold)
function HordeCrest() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-10 h-10 md:w-12 md:h-12"
      aria-label="Emblema de la Horda"
    >
      <polygon
        points="50,5 65,35 95,35 70,55 80,90 50,70 20,90 30,55 5,35 35,35"
        fill="#8B0000"
        stroke="#F8B700"
        strokeWidth="2"
      />
      <circle cx="50" cy="48" r="12" fill="#0a0a0a" stroke="#F8B700" strokeWidth="1.5" />
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();

  // Links de navegación principales
  const navLinks = [
    { href: "/", label: "Semanal" },
    { href: "/personajes", label: "Personajes" },
    { href: "/rutas", label: "Rutas" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-horda-bg/95 backdrop-blur-sm border-b border-horda-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo + título */}
        <Link href="/" className="flex items-center gap-3 group">
          <HordeCrest />
          <div>
            <h1 className="font-cinzel text-horda-gold text-lg md:text-xl tracking-wider group-hover:text-white transition-colors">
              WOW EXPLORADOR
            </h1>
            <p className="text-horda-muted text-[10px] md:text-xs leading-tight -mt-0.5">
              Quel&apos;Thalas · US
            </p>
          </div>
        </Link>

        {/* Navegación */}
        <nav className="flex items-center gap-1 md:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-2 text-sm rounded transition-colors font-exo tracking-wide",
                "hover:bg-horda-surface-2 hover:text-horda-gold",
                pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                  ? "text-horda-gold border-b-2 border-horda-gold"
                  : "text-horda-text border-b-2 border-transparent"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
