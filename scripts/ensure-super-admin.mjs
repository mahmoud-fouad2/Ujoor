import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("[ensure-super-admin] Missing DATABASE_URL");
  process.exit(1);
}

const superAdminEmailRaw = process.env.SUPER_ADMIN_EMAIL;
const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;

if (!superAdminEmailRaw || !superAdminPassword) {
  console.log(
    "[ensure-super-admin] SUPER_ADMIN_EMAIL/PASSWORD not set; skipping super admin bootstrap."
  );
  process.exit(0);
}

const superAdminEmail = superAdminEmailRaw.toLowerCase();

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const usersCount = await prisma.user.count();

  if (usersCount > 0) {
    console.log(`[ensure-super-admin] Users already exist (${usersCount}); skipping.`);
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email: superAdminEmail } });
  if (existing) {
    console.log("[ensure-super-admin] Super admin already exists; skipping.");
    return;
  }

  const passwordHash = await hash(superAdminPassword, 12);

  const created = await prisma.user.create({
    data: {
      email: superAdminEmail,
      password: passwordHash,
      firstName: "Super",
      lastName: "Admin",
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      permissions: [],
      lastLoginAt: null,
    },
    select: { id: true, email: true },
  });

  console.log(`[ensure-super-admin] Created super admin: ${created.email}`);
}

main()
  .catch((err) => {
    console.error("[ensure-super-admin] Failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect().catch(() => {});
  });
