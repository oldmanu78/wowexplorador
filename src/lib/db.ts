// Cliente Prisma singleton para toda la aplicación
// Usa el adapter better-sqlite3 para conectarse a SQLite (Prisma v7)
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Lee la URL de la base de datos del entorno, con fallback a la ruta por defecto
const dbUrl = process.env.DATABASE_URL || "file:./prisma/wow.db";

// Crea el adapter de better-sqlite3 usando la URL del archivo SQLite
const adapter = new PrismaBetterSqlite3({ url: dbUrl });

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
