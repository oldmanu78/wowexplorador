// Header principal con el emblema de la Horda, navegación y título
'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn, withBasePath } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();

  // Links de navegación principales
  const navLinks = [
    { href: "/", label: "Semanal" },
    { href: "/personajes", label: "Personajes" },
    { href: "/rutas", label: "Rutas" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-horda-border/90 bg-horda-bg/86 shadow-[0_10px_30px_rgba(0,0,0,0.38)] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo + título */}
        <Link href="/" className="flex items-center gap-3 group min-w-0">
          <span className="relative grid h-12 w-12 shrink-0 place-items-center">
            <span className="absolute inset-0 rounded-full bg-horda-red/25 blur-md transition-opacity group-hover:opacity-90" />
            <Image
              src={withBasePath("/horde-crest.svg")}
              alt="Emblema de la Horda"
              width={44}
              height={44}
              className="relative h-11 w-11 drop-shadow-[0_0_10px_rgba(248,183,0,0.22)]"
            />
          </span>
          <div>
            <h1 className="font-cinzel text-horda-gold text-lg md:text-xl tracking-[0.18em] [text-shadow:0_1px_0_#3a120d,0_0_18px_rgba(248,183,0,0.18)] group-hover:text-white transition-colors">
              WOW EXPLORADOR
            </h1>
            <p className="text-horda-muted text-[10px] md:text-xs leading-tight -mt-0.5 tracking-[0.2em] uppercase">
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
