/**
 * Database Seed Script
 * Creates initial super admin and demo tenant
 * 
 * Run with: npx prisma db seed
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

// Create Prisma client with adapter for Prisma 7
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seed...");

  // ============================================
  // 1. Create Super Admin
  // ============================================
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || "admin@ujoor.com";
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || "Admin@123456";

  const existingSuperAdmin = await prisma.user.findUnique({
    where: { email: superAdminEmail },
  });

  if (!existingSuperAdmin) {
    const hashedPassword = await hash(superAdminPassword, 12);

    await prisma.user.create({
      data: {
        email: superAdminEmail,
        password: hashedPassword,
        firstName: "Super",
        lastName: "Admin",
        role: "SUPER_ADMIN",
        status: "ACTIVE",
        permissions: ["*"], // All permissions
      },
    });

    console.log(`✅ Super Admin created: ${superAdminEmail}`);
  } else {
    console.log(`ℹ️  Super Admin already exists: ${superAdminEmail}`);
  }

  // ============================================
  // 2. Create Demo Tenant (Optional)
  // ============================================
  const demoTenantSlug = "demo";

  const existingTenant = await prisma.tenant.findUnique({
    where: { slug: demoTenantSlug },
  });

  if (!existingTenant) {
    const tenant = await prisma.tenant.create({
      data: {
        name: "Demo Company",
        nameAr: "شركة تجريبية",
        slug: demoTenantSlug,
        plan: "PROFESSIONAL",
        maxEmployees: 100,
        status: "ACTIVE",
        timezone: "Asia/Riyadh",
        currency: "SAR",
        settings: {
          language: "ar",
          dateFormat: "DD/MM/YYYY",
          timeFormat: "12h",
        },
      },
    });

    // Create tenant admin
    const tenantAdminPassword = await hash("Demo@123456", 12);

    const tenantAdmin = await prisma.user.create({
      data: {
        tenantId: tenant.id,
        email: "admin@demo.ujoor.com",
        password: tenantAdminPassword,
        firstName: "مدير",
        lastName: "النظام",
        role: "TENANT_ADMIN",
        status: "ACTIVE",
        permissions: [],
      },
    });

    // Create default department
    const department = await prisma.department.create({
      data: {
        tenantId: tenant.id,
        name: "General",
        nameAr: "إدارة عامة",
        code: "GEN",
        isActive: true,
      },
    });

    // Create default job title
    const jobTitle = await prisma.jobTitle.create({
      data: {
        tenantId: tenant.id,
        name: "Employee",
        nameAr: "موظف",
        code: "EMP",
        level: 1,
        isActive: true,
      },
    });

    // Create default shift
    const shift = await prisma.shift.create({
      data: {
        tenantId: tenant.id,
        name: "Morning Shift",
        nameAr: "الوردية الصباحية",
        code: "MORNING",
        startTime: "08:00",
        endTime: "16:00",
        breakStartTime: "12:00",
        breakEndTime: "13:00",
        breakDurationMinutes: 60,
        flexibleStartMinutes: 15,
        flexibleEndMinutes: 15,
        workDays: [0, 1, 2, 3, 4], // Sun-Thu
        overtimeEnabled: true,
        overtimeMultiplier: 1.5,
        color: "#3B82F6",
        isDefault: true,
        isActive: true,
      },
    });

    // Create default leave types
    const leaveTypes = [
      {
        name: "Annual Leave",
        nameAr: "إجازة سنوية",
        code: "ANNUAL",
        defaultDays: 21,
        maxDays: 30,
        carryOverDays: 5,
        isPaid: true,
        color: "#10B981",
      },
      {
        name: "Sick Leave",
        nameAr: "إجازة مرضية",
        code: "SICK",
        defaultDays: 30,
        maxDays: 120,
        isPaid: true,
        requiresAttachment: true,
        color: "#EF4444",
      },
      {
        name: "Unpaid Leave",
        nameAr: "إجازة بدون راتب",
        code: "UNPAID",
        defaultDays: 0,
        maxDays: 60,
        isPaid: false,
        color: "#6B7280",
      },
    ];

    for (const lt of leaveTypes) {
      await prisma.leaveType.create({
        data: {
          tenantId: tenant.id,
          ...lt,
          isActive: true,
        },
      });
    }

    // Create employee record for tenant admin
    await prisma.employee.create({
      data: {
        tenantId: tenant.id,
        userId: tenantAdmin.id,
        employeeNumber: "EMP001",
        firstName: "مدير",
        lastName: "النظام",
        email: "admin@demo.ujoor.com",
        departmentId: department.id,
        jobTitleId: jobTitle.id,
        shiftId: shift.id,
        hireDate: new Date(),
        employmentType: "FULL_TIME",
        status: "ACTIVE",
        baseSalary: 15000,
        currency: "SAR",
      },
    });

    console.log(`✅ Demo tenant created: ${demoTenantSlug}`);
    console.log(`✅ Tenant admin: admin@demo.ujoor.com / Demo@123456`);
  } else {
    console.log(`ℹ️  Demo tenant already exists`);
  }

  console.log("\n🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
