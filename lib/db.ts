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

  // For Render Free Tier - need to limit connections
  const connString = connectionString.includes("?")
    ? connectionString + "&pool_size=5&application_name=ujoor"
    : connectionString + "?pool_size=5&application_name=ujoor";

  // Prisma 7: provide a direct database connection via an adapter.
  // PrismaPg supports standard `postgresql://` URLs (Render, etc.).
  const adapter = new PrismaPg({ connectionString: connString });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
