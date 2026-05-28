// Footer con créditos, año y enlaces
export default function Footer() {
  return (
    <footer className="border-t border-horda-border bg-horda-bg mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-horda-muted">
        {/* Créditos principales */}
        <p>
          Hecho con 💀 por{" "}
          <span className="text-horda-gold">oldmanu78</span> ·{" "}
          <span className="text-horda-text">WoW Explorador</span>
        </p>

        {/* Links externos */}
        <div className="flex items-center gap-4">
          <a
            href="https://raider.io"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-horda-gold transition-colors"
          >
            Raider.io
          </a>
          <a
            href="https://worldofwarcraft.blizzard.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-horda-gold transition-colors"
          >
            Blizzard
          </a>
          <a
            href="https://keystone.guru"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-horda-gold transition-colors"
          >
            Keystone.guru
          </a>
        </div>
      </div>
    </footer>
  );
}
