-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('APPLIED', 'SHORTLISTED', 'SUBMITTED', 'INTERVIEW_SCHEDULED', 'INTERVIEW_COMPLETED', 'SELECTED', 'OFFER_SENT', 'JOINED', 'REJECTED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "candidates" (
    "id" TEXT NOT NULL,
    "fullName" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "phone" VARCHAR(30) NOT NULL,
    "location" VARCHAR(100) NOT NULL,
    "currentCompany" VARCHAR(150),
    "experience" VARCHAR(50) NOT NULL,
    "portfolioUrl" VARCHAR(300),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "candidates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "referenceId" VARCHAR(40) NOT NULL,
    "jobSlug" VARCHAR(160) NOT NULL,
    "jobTitle" VARCHAR(200) NOT NULL,
    "coverLetter" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'APPLIED',
    "cvOriginalName" VARCHAR(255) NOT NULL,
    "cvMimeType" VARCHAR(150) NOT NULL,
    "cvSize" INTEGER NOT NULL,
    "cvStorageKey" VARCHAR(500),
    "consentAt" TIMESTAMP(3) NOT NULL,
    "candidateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "candidates_email_key" ON "candidates"("email");

-- CreateIndex
CREATE INDEX "candidates_fullName_idx" ON "candidates"("fullName");

-- CreateIndex
CREATE INDEX "candidates_phone_idx" ON "candidates"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "applications_referenceId_key" ON "applications"("referenceId");

-- CreateIndex
CREATE INDEX "applications_status_idx" ON "applications"("status");

-- CreateIndex
CREATE INDEX "applications_jobSlug_idx" ON "applications"("jobSlug");

-- CreateIndex
CREATE INDEX "applications_createdAt_idx" ON "applications"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "applications_candidateId_jobSlug_key" ON "applications"("candidateId", "jobSlug");

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
