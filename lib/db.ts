/**
 * Prisma Database Client
 * Singleton pattern for Next.js (prevents multiple instances in dev)
 * Using Prisma 7 with pg adapter
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  // For Prisma Postgres (prisma+postgres://) use the adapter
  // For standard PostgreSQL (postgresql://) use direct connection
  const isPrismaPostgres = connectionString.startsWith("prisma+postgres://");
  
  if (isPrismaPostgres) {
    const adapter = new PrismaPg({ connectionString });
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  }
  
  // Standard PostgreSQL connection (Render, Supabase, etc.)
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
