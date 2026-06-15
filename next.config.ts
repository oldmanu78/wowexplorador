// Configuración de Next.js para WoW Explorer
// output: 'export' genera HTML estático para GitHub Pages
// basePath: '/wowexplorador' porque el sitio está en oldmanu78.github.io/wowexplorador
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  output: "export",
  basePath: "/wowexplorador",
  assetPrefix: "/wowexplorador/",
  env: {
    NEXT_PUBLIC_BASE_PATH: "/wowexplorador",
  },
  images: {
    unoptimized: true, // GitHub Pages no soporta optimización de imágenes de Next.js
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wow.zamimg.com",
      },
    ],
  },
  // Deshabilitar verificación de tipos durante el build
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
