-- CreateEnum
CREATE TYPE "EvaluationCycleStatus" AS ENUM ('DRAFT', 'ACTIVE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EvaluationStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'PENDING_REVIEW', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "GoalStatus" AS ENUM ('DRAFT', 'ACTIVE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'OVERDUE');

-- CreateEnum
CREATE TYPE "GoalPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateTable
CREATE TABLE "EvaluationCycle" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameAr" TEXT,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "reviewDeadline" TIMESTAMP(3),
    "status" "EvaluationCycleStatus" NOT NULL DEFAULT 'DRAFT',
    "templateId" TEXT,
    "targetDepartments" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "targetEmployees" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EvaluationCycle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeEvaluation" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "cycleId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "evaluatorId" TEXT,
    "status" "EvaluationStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "overallScore" DECIMAL(5,2),
    "overallRating" TEXT,
    "scores" JSONB NOT NULL DEFAULT '[]',
    "strengths" TEXT,
    "areasForImprovement" TEXT,
    "comments" TEXT,
    "employeeComments" TEXT,
    "employeeAcknowledgedAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformanceGoal" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleAr" TEXT,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'performance',
    "priority" "GoalPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "GoalStatus" NOT NULL DEFAULT 'DRAFT',
    "targetValue" TEXT,
    "currentValue" TEXT,
    "unit" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "progress" INTEGER NOT NULL DEFAULT 0,
    "managerId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PerformanceGoal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EvaluationCycle_tenantId_idx" ON "EvaluationCycle"("tenantId");

-- CreateIndex
CREATE INDEX "EvaluationCycle_tenantId_status_idx" ON "EvaluationCycle"("tenantId", "status");

-- CreateIndex
CREATE INDEX "EmployeeEvaluation_tenantId_idx" ON "EmployeeEvaluation"("tenantId");

-- CreateIndex
CREATE INDEX "EmployeeEvaluation_tenantId_cycleId_idx" ON "EmployeeEvaluation"("tenantId", "cycleId");

-- CreateIndex
CREATE INDEX "EmployeeEvaluation_tenantId_employeeId_idx" ON "EmployeeEvaluation"("tenantId", "employeeId");

-- CreateIndex
CREATE INDEX "EmployeeEvaluation_tenantId_status_idx" ON "EmployeeEvaluation"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeEvaluation_tenantId_cycleId_employeeId_key" ON "EmployeeEvaluation"("tenantId", "cycleId", "employeeId");

-- CreateIndex
CREATE INDEX "PerformanceGoal_tenantId_idx" ON "PerformanceGoal"("tenantId");

-- CreateIndex
CREATE INDEX "PerformanceGoal_tenantId_employeeId_idx" ON "PerformanceGoal"("tenantId", "employeeId");

-- CreateIndex
CREATE INDEX "PerformanceGoal_tenantId_status_idx" ON "PerformanceGoal"("tenantId", "status");

-- AddForeignKey
ALTER TABLE "EvaluationCycle" ADD CONSTRAINT "EvaluationCycle_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationCycle" ADD CONSTRAINT "EvaluationCycle_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeEvaluation" ADD CONSTRAINT "EmployeeEvaluation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeEvaluation" ADD CONSTRAINT "EmployeeEvaluation_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "EvaluationCycle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeEvaluation" ADD CONSTRAINT "EmployeeEvaluation_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeEvaluation" ADD CONSTRAINT "EmployeeEvaluation_evaluatorId_fkey" FOREIGN KEY ("evaluatorId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceGoal" ADD CONSTRAINT "PerformanceGoal_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceGoal" ADD CONSTRAINT "PerformanceGoal_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceGoal" ADD CONSTRAINT "PerformanceGoal_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
