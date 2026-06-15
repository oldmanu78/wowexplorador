import Link from "next/link";
import HordeEmblem from "@/components/ui/HordeEmblem";

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(240,195,90,0.16)] bg-[#050403] mt-auto">
      <div className="max-w-[1180px] mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-[1.4fr_repeat(3,1fr)] gap-6">
        <div>
          <div className="inline-flex items-center gap-3 no-underline">
            <HordeEmblem className="h-12 w-8" />
            <div>
              <span className="block font-cinzel font-black tracking-[0.08em] leading-none text-gold">
                WoW EXPLORADOR
              </span>
              <small className="block mt-1 text-muted text-[0.68rem] font-extrabold tracking-[0.18em] uppercase">
                Horde Tracker
              </small>
            </div>
          </div>
          <p className="text-muted text-sm leading-relaxed mt-4 max-w-sm">
            Panel de seguimiento y datos de World of Warcraft para la Horda de Quel&apos;Thalas US.
            No afiliado oficialmente con Blizzard Entertainment.
          </p>
        </div>

        <div>
          <h3 className="font-cinzel text-bone text-[0.92rem] uppercase tracking-wide mb-3">Secciones</h3>
          <ul className="grid gap-2 list-none p-0 m-0">
            <li><Link href="/" className="text-muted text-sm no-underline hover:text-gold transition-colors">Panel Semanal</Link></li>
            <li><Link href="/personajes" className="text-muted text-sm no-underline hover:text-gold transition-colors">Personajes</Link></li>
            <li><Link href="/rutas" className="text-muted text-sm no-underline hover:text-gold transition-colors">Rutas M+</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-cinzel text-bone text-[0.92rem] uppercase tracking-wide mb-3">Comunidad</h3>
          <ul className="grid gap-2 list-none p-0 m-0">
            <li><a href="https://raider.io" target="_blank" rel="noopener noreferrer" className="text-muted text-sm no-underline hover:text-gold transition-colors">Raider.io</a></li>
            <li><a href="https://worldofwarcraft.blizzard.com" target="_blank" rel="noopener noreferrer" className="text-muted text-sm no-underline hover:text-gold transition-colors">Blizzard</a></li>
            <li><a href="https://keystone.guru" target="_blank" rel="noopener noreferrer" className="text-muted text-sm no-underline hover:text-gold transition-colors">Keystone.guru</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-cinzel text-bone text-[0.92rem] uppercase tracking-wide mb-3">Actualizacion</h3>
          <p className="text-muted text-sm leading-relaxed">
            Datos actualizados semanalmente via pipeline automatizado con APIs de Raider.io y Blizzard.
          </p>
        </div>
      </div>

      <div className="border-t border-[rgba(240,195,90,0.1)]">
        <div className="max-w-[1180px] mx-auto px-4 py-4 text-center text-xs text-muted">
          Hecho por oldmanu78 — WoW Explorador {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}
