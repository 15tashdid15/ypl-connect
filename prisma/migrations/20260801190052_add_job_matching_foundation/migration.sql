-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT NOT NULL,
    "companyName" VARCHAR(200) NOT NULL,
    "location" VARCHAR(150),
    "employmentType" VARCHAR(50),
    "experienceRequired" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_search_profiles" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "searchableText" TEXT NOT NULL,
    "requiredSkills" TEXT[],
    "requiredExperience" INTEGER,
    "educationRequirement" VARCHAR(150),
    "embedding" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_search_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "jobs_title_idx" ON "jobs"("title");

-- CreateIndex
CREATE INDEX "jobs_companyName_idx" ON "jobs"("companyName");

-- CreateIndex
CREATE INDEX "job_search_profiles_jobId_idx" ON "job_search_profiles"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "job_search_profiles_jobId_key" ON "job_search_profiles"("jobId");

-- AddForeignKey
ALTER TABLE "job_search_profiles" ADD CONSTRAINT "job_search_profiles_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
