// Configuración de Prisma para WoW Explorer
// La URL de conexión se lee desde .env (DATABASE_URL)
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"] || "file:./prisma/wow.db",
  },
});
