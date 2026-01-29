-- CreateEnum
CREATE TYPE "JobPostingStatus" AS ENUM ('DRAFT', 'ACTIVE', 'CLOSED', 'FILLED');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'TEMPORARY');

-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('ENTRY', 'JUNIOR', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('NEW', 'SCREENING', 'SHORTLISTED', 'INTERVIEW', 'OFFER', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "InterviewType" AS ENUM ('PHONE', 'VIDEO', 'IN_PERSON', 'TECHNICAL', 'HR', 'FINAL');

-- CreateEnum
CREATE TYPE "InterviewStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateTable
CREATE TABLE "JobPosting" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleAr" TEXT,
    "description" TEXT NOT NULL,
    "requirements" TEXT,
    "responsibilities" TEXT,
    "benefits" TEXT,
    "departmentId" TEXT,
    "jobTitleId" TEXT,
    "status" "JobPostingStatus" NOT NULL DEFAULT 'DRAFT',
    "jobType" "JobType" NOT NULL DEFAULT 'FULL_TIME',
    "experienceLevel" "ExperienceLevel" NOT NULL DEFAULT 'MID',
    "positions" INTEGER NOT NULL DEFAULT 1,
    "location" TEXT,
    "salaryMin" DECIMAL(12,2),
    "salaryMax" DECIMAL(12,2),
    "salaryCurrency" TEXT DEFAULT 'SAR',
    "postedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobPosting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Applicant" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "jobPostingId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "resumeUrl" TEXT,
    "coverLetter" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'NEW',
    "source" TEXT DEFAULT 'career-portal',
    "rating" INTEGER,
    "notes" TEXT,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Applicant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interview" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "jobPostingId" TEXT NOT NULL,
    "type" "InterviewType" NOT NULL DEFAULT 'HR',
    "status" "InterviewStatus" NOT NULL DEFAULT 'SCHEDULED',
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 60,
    "location" TEXT,
    "meetingLink" TEXT,
    "interviewerId" TEXT,
    "feedback" TEXT,
    "rating" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Interview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JobPosting_tenantId_idx" ON "JobPosting"("tenantId");

-- CreateIndex
CREATE INDEX "JobPosting_tenantId_status_idx" ON "JobPosting"("tenantId", "status");

-- CreateIndex
CREATE INDEX "JobPosting_tenantId_departmentId_idx" ON "JobPosting"("tenantId", "departmentId");

-- CreateIndex
CREATE INDEX "JobPosting_postedAt_idx" ON "JobPosting"("postedAt");

-- CreateIndex
CREATE INDEX "Applicant_tenantId_idx" ON "Applicant"("tenantId");

-- CreateIndex
CREATE INDEX "Applicant_tenantId_jobPostingId_idx" ON "Applicant"("tenantId", "jobPostingId");

-- CreateIndex
CREATE INDEX "Applicant_tenantId_status_idx" ON "Applicant"("tenantId", "status");

-- CreateIndex
CREATE INDEX "Applicant_email_idx" ON "Applicant"("email");

-- CreateIndex
CREATE INDEX "Interview_tenantId_idx" ON "Interview"("tenantId");

-- CreateIndex
CREATE INDEX "Interview_tenantId_applicantId_idx" ON "Interview"("tenantId", "applicantId");

-- CreateIndex
CREATE INDEX "Interview_tenantId_jobPostingId_idx" ON "Interview"("tenantId", "jobPostingId");

-- CreateIndex
CREATE INDEX "Interview_tenantId_interviewerId_idx" ON "Interview"("tenantId", "interviewerId");

-- CreateIndex
CREATE INDEX "Interview_scheduledAt_idx" ON "Interview"("scheduledAt");

-- AddForeignKey
ALTER TABLE "JobPosting" ADD CONSTRAINT "JobPosting_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobPosting" ADD CONSTRAINT "JobPosting_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobPosting" ADD CONSTRAINT "JobPosting_jobTitleId_fkey" FOREIGN KEY ("jobTitleId") REFERENCES "JobTitle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobPosting" ADD CONSTRAINT "JobPosting_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_jobPostingId_fkey" FOREIGN KEY ("jobPostingId") REFERENCES "JobPosting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_jobPostingId_fkey" FOREIGN KEY ("jobPostingId") REFERENCES "JobPosting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_interviewerId_fkey" FOREIGN KEY ("interviewerId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
