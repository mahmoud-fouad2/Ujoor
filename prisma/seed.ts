/**
 * Database Seed Script
 * Creates initial super admin and demo tenant
 * 
 * Run with: npx prisma db seed
 */

import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
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
  // 2. Create Multiple Demo Tenants
  // ============================================
  const tenants = [
    {
      slug: "demo",
      name: "Demo Company",
      nameAr: "شركة تجريبية",
      plan: "PROFESSIONAL" as const,
      adminEmail: "admin@demo.ujoor.com",
    },
    {
      slug: "elite-tech",
      name: "Elite Technology Co.",
      nameAr: "شركة النخبة للتقنية",
      plan: "PROFESSIONAL" as const,
      adminEmail: "admin@elite-tech.ujoor.com",
    },
    {
      slug: "riyadh-trading",
      name: "Riyadh Trading Est.",
      nameAr: "مؤسسة الرياض التجارية",
      plan: "BASIC" as const,
      adminEmail: "admin@riyadh-trading.ujoor.com",
    },
    {
      slug: "future-co",
      name: "Future Company",
      nameAr: "شركة المستقبل",
      plan: "ENTERPRISE" as const,
      adminEmail: "admin@future-co.ujoor.com",
    },
  ];

  for (const tenantData of tenants) {
    const existingTenant = await prisma.tenant.findUnique({
      where: { slug: tenantData.slug },
    });

    if (!existingTenant) {
      const tenant = await prisma.tenant.create({
        data: {
          name: tenantData.name,
          nameAr: tenantData.nameAr,
          slug: tenantData.slug,
          plan: tenantData.plan,
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
      const tenantAdminPassword = await hash("Admin@123456", 12);

      const tenantAdmin = await prisma.user.create({
        data: {
          tenantId: tenant.id,
          email: tenantData.adminEmail,
          password: tenantAdminPassword,
          firstName: "مدير",
          lastName: tenantData.nameAr,
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
          employeeNumber: "000001",
          firstName: "مدير",
          lastName: tenantData.nameAr,
          email: tenantData.adminEmail,
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

      console.log(`✅ Tenant created: ${tenantData.slug}`);
      console.log(`   Admin: ${tenantData.adminEmail} / Admin@123456`);
    } else {
      console.log(`ℹ️  Tenant already exists: ${tenantData.slug}`);
    }
  }

  // ============================================
  // 3. Seed Pricing Plans
  // ============================================
  const pricingPlans = [
    {
      name: "Starter",
      nameAr: "الأساسية",
      slug: "starter",
      priceMonthly: 499,
      priceYearly: 4990,
      currency: "SAR",
      maxEmployees: 25,
      employeesLabel: "حتى 25 موظف",
      employeesLabelEn: "Up to 25 employees",
      featuresAr: ["إدارة الموظفين", "الحضور والانصراف", "الإجازات", "التقارير الأساسية"],
      featuresEn: ["Employee management", "Time & attendance", "Leave management", "Basic reports"],
      planType: "BASIC" as const,
      isPopular: false,
      sortOrder: 1,
    },
    {
      name: "Business",
      nameAr: "الأعمال",
      slug: "business",
      priceMonthly: 999,
      priceYearly: 9990,
      currency: "SAR",
      maxEmployees: 100,
      employeesLabel: "حتى 100 موظف",
      employeesLabelEn: "Up to 100 employees",
      featuresAr: ["كل مميزات الأساسية", "إدارة الرواتب", "تصدير WPS", "دعم فني متقدم"],
      featuresEn: ["Everything in Starter", "Payroll", "WPS export", "Priority support"],
      planType: "PROFESSIONAL" as const,
      isPopular: true,
      sortOrder: 2,
    },
    {
      name: "Enterprise",
      nameAr: "المؤسسات",
      slug: "enterprise",
      priceMonthly: null,
      priceYearly: null,
      currency: "SAR",
      maxEmployees: null,
      employeesLabel: "غير محدود",
      employeesLabelEn: "Unlimited",
      featuresAr: ["كل مميزات الأعمال", "تكاملات مخصصة", "وصول API", "مدير حساب مخصص"],
      featuresEn: ["Everything in Business", "Custom integrations", "API access", "Dedicated account manager"],
      planType: "ENTERPRISE" as const,
      isPopular: false,
      sortOrder: 3,
    },
  ];

  for (const plan of pricingPlans) {
    const existing = await prisma.pricingPlan.findUnique({
      where: { slug: plan.slug },
    });

    if (!existing) {
      await prisma.pricingPlan.create({
        data: plan,
      });
      console.log(`✅ Pricing plan created: ${plan.name}`);
    } else {
      console.log(`ℹ️  Pricing plan already exists: ${plan.name}`);
    }
  }

  // ============================================
  // 4. Seed Feature Comparison
  // ============================================
  const features = [
    { featureAr: "إدارة الموظفين", featureEn: "Employee management", inStarter: true, inBusiness: true, inEnterprise: true, sortOrder: 1 },
    { featureAr: "الحضور والانصراف", featureEn: "Time & attendance", inStarter: true, inBusiness: true, inEnterprise: true, sortOrder: 2 },
    { featureAr: "إدارة الإجازات", featureEn: "Leave management", inStarter: true, inBusiness: true, inEnterprise: true, sortOrder: 3 },
    { featureAr: "الرواتب", featureEn: "Payroll", inStarter: false, inBusiness: true, inEnterprise: true, sortOrder: 4 },
    { featureAr: "تصدير WPS", featureEn: "WPS export", inStarter: false, inBusiness: true, inEnterprise: true, sortOrder: 5 },
    { featureAr: "صلاحيات وأدوار", featureEn: "Roles & permissions", inStarter: true, inBusiness: true, inEnterprise: true, sortOrder: 6 },
    { featureAr: "التقارير المتقدمة", featureEn: "Advanced reports", inStarter: false, inBusiness: true, inEnterprise: true, sortOrder: 7 },
    { featureAr: "تكاملات مخصصة", featureEn: "Custom integrations", inStarter: false, inBusiness: false, inEnterprise: true, sortOrder: 8 },
    { featureAr: "وصول API", featureEn: "API access", inStarter: false, inBusiness: false, inEnterprise: true, sortOrder: 9 },
    { featureAr: "مدير حساب مخصص", featureEn: "Dedicated account manager", inStarter: false, inBusiness: false, inEnterprise: true, sortOrder: 10 },
  ];

  const existingFeatures = await prisma.planFeatureComparison.count();
  if (existingFeatures === 0) {
    await prisma.planFeatureComparison.createMany({
      data: features,
    });
    console.log(`✅ Feature comparison seeded: ${features.length} features`);
  } else {
    console.log(`ℹ️  Feature comparison already exists`);
  }

  // ============================================
  // 5. Seed Platform Settings
  // ============================================
  const existingSettings = await prisma.platformSettings.findFirst();
  if (!existingSettings) {
    await prisma.platformSettings.create({
      data: {
        platformName: "أجور",
        platformNameEn: "Ujoors",
        supportEmail: "support@ujoor.com",
        trialDays: 14,
        trialMaxEmployees: 10,
        primaryColor: "#0284c7",
      },
    });
    console.log(`✅ Platform settings created`);
  } else {
    console.log(`ℹ️  Platform settings already exists`);
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
