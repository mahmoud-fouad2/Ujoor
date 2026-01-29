-- CreateEnum
CREATE TYPE "TrainingCourseStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TrainingCourseType" AS ENUM ('IN_PERSON', 'ONLINE', 'HYBRID', 'SELF_PACED', 'WORKSHOP', 'CONFERENCE');

-- CreateEnum
CREATE TYPE "TrainingCourseCategory" AS ENUM ('TECHNICAL', 'SOFT_SKILLS', 'LEADERSHIP', 'COMPLIANCE', 'SAFETY', 'ONBOARDING', 'OTHER');

-- CreateEnum
CREATE TYPE "TrainingEnrollmentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'ENROLLED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'WITHDRAWN');

-- CreateTable
CREATE TABLE "TrainingCourse" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleEn" TEXT,
    "description" TEXT NOT NULL,
    "descriptionEn" TEXT,
    "category" "TrainingCourseCategory" NOT NULL DEFAULT 'OTHER',
    "type" "TrainingCourseType" NOT NULL DEFAULT 'IN_PERSON',
    "status" "TrainingCourseStatus" NOT NULL DEFAULT 'DRAFT',
    "provider" TEXT,
    "instructorName" TEXT,
    "durationHours" INTEGER NOT NULL DEFAULT 1,
    "maxParticipants" INTEGER,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "location" TEXT,
    "meetingLink" TEXT,
    "objectives" JSONB NOT NULL DEFAULT '[]',
    "prerequisites" JSONB NOT NULL DEFAULT '[]',
    "targetDepartments" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "targetRoles" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "cost" DECIMAL(12,2),
    "currency" TEXT NOT NULL DEFAULT 'SAR',
    "isMandatory" BOOLEAN NOT NULL DEFAULT false,
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingEnrollment" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "status" "TrainingEnrollmentStatus" NOT NULL DEFAULT 'PENDING',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "score" DECIMAL(5,2),
    "feedback" TEXT,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TrainingCourse_tenantId_idx" ON "TrainingCourse"("tenantId");

-- CreateIndex
CREATE INDEX "TrainingCourse_tenantId_status_idx" ON "TrainingCourse"("tenantId", "status");

-- CreateIndex
CREATE INDEX "TrainingCourse_tenantId_category_idx" ON "TrainingCourse"("tenantId", "category");

-- CreateIndex
CREATE INDEX "TrainingEnrollment_tenantId_idx" ON "TrainingEnrollment"("tenantId");

-- CreateIndex
CREATE INDEX "TrainingEnrollment_tenantId_courseId_idx" ON "TrainingEnrollment"("tenantId", "courseId");

-- CreateIndex
CREATE INDEX "TrainingEnrollment_tenantId_employeeId_idx" ON "TrainingEnrollment"("tenantId", "employeeId");

-- CreateIndex
CREATE INDEX "TrainingEnrollment_tenantId_status_idx" ON "TrainingEnrollment"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingEnrollment_tenantId_courseId_employeeId_key" ON "TrainingEnrollment"("tenantId", "courseId", "employeeId");

-- AddForeignKey
ALTER TABLE "TrainingCourse" ADD CONSTRAINT "TrainingCourse_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingCourse" ADD CONSTRAINT "TrainingCourse_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingEnrollment" ADD CONSTRAINT "TrainingEnrollment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingEnrollment" ADD CONSTRAINT "TrainingEnrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "TrainingCourse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingEnrollment" ADD CONSTRAINT "TrainingEnrollment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
