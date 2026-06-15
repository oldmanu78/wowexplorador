'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import HordeEmblem from "@/components/ui/HordeEmblem";

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Semanal" },
    { href: "/personajes", label: "Personajes" },
    { href: "/rutas", label: "Rutas" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-20 border-b border-[rgba(240,195,90,0.18)] bg-[rgba(7,5,4,0.82)] backdrop-blur-[16px]">
      <nav className="min-h-[72px] flex items-center justify-between gap-5 max-w-[1180px] mx-auto px-4" aria-label="Navegacion principal">
        <Link href="/" className="inline-flex items-center gap-3 no-underline min-h-[44px] group" aria-label="WoW Explorador inicio">
          <HordeEmblem className="h-12 w-8 transition-transform duration-180 group-hover:scale-105" />
          <div>
            <span className="block font-cinzel font-black tracking-[0.08em] leading-none text-gold text-lg group-hover:text-bone transition-colors">
              WoW EXPLORADOR
            </span>
            <small className="block mt-1 text-muted text-[0.68rem] font-extrabold tracking-[0.18em] uppercase">
              Quel&apos;Thalas · US
            </small>
          </div>
        </Link>

        <ul className="flex items-center gap-1.5 list-none m-0 p-0">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "inline-flex min-h-[44px] items-center px-3.5 rounded-md text-[0.82rem] font-extrabold tracking-[0.08em] uppercase no-underline transition-all duration-180",
                  pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                    ? "text-gold bg-[rgba(240,195,90,0.08)]"
                    : "text-muted hover:text-gold hover:bg-[rgba(240,195,90,0.08)]"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
