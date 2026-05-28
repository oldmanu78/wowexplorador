// Configuración de Next.js para WoW Explorer
// output: 'export' genera HTML estático para GitHub Pages
// basePath: '/wowexplorador' porque el sitio está en oldmanu78.github.io/wowexplorador
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/wowexplorador",
  assetPrefix: "/wowexplorador/",
  images: {
    unoptimized: true, // GitHub Pages no soporta optimización de imágenes de Next.js
  },
  // Deshabilitar verificación de tipos durante el build
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
