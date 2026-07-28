-- CreateEnum
CREATE TYPE "ApplicationActivityType" AS ENUM ('STATUS_CHANGE', 'NOTE');

-- CreateTable
CREATE TABLE "application_activities" (
    "id" TEXT NOT NULL,
    "type" "ApplicationActivityType" NOT NULL,
    "message" TEXT,
    "previousStatus" "ApplicationStatus",
    "newStatus" "ApplicationStatus",
    "applicationId" TEXT NOT NULL,
    "recruiterId" TEXT NOT NULL,
    "recruiterName" VARCHAR(100) NOT NULL,
    "recruiterEmail" VARCHAR(150) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "application_activities_applicationId_createdAt_idx" ON "application_activities"("applicationId", "createdAt");

-- CreateIndex
CREATE INDEX "application_activities_recruiterId_createdAt_idx" ON "application_activities"("recruiterId", "createdAt");

-- CreateIndex
CREATE INDEX "application_activities_type_idx" ON "application_activities"("type");

-- AddForeignKey
ALTER TABLE "application_activities" ADD CONSTRAINT "application_activities_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_activities" ADD CONSTRAINT "application_activities_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
