-- CreateEnum
CREATE TYPE "CandidateDocumentType" AS ENUM ('CV', 'COVER_LETTER', 'CERTIFICATE', 'PORTFOLIO', 'OTHER');

-- CreateEnum
CREATE TYPE "CandidateDocumentSource" AS ENUM ('APPLICATION_UPLOAD', 'RECRUITER_UPLOAD', 'CANDIDATE_UPLOAD', 'LEGACY_BACKFILL');

-- CreateEnum
CREATE TYPE "CvParseStatus" AS ENUM ('QUEUED', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CvParseTrigger" AS ENUM ('R2_EVENT', 'MANUAL', 'RETRY', 'BACKFILL');

-- CreateEnum
CREATE TYPE "CvReviewStatus" AS ENUM ('UNREVIEWED', 'IN_REVIEW', 'PARTIALLY_VERIFIED', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "CvParseJobStatus" AS ENUM ('QUEUED', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "candidate_documents" (
    "id" TEXT NOT NULL,
    "type" "CandidateDocumentType" NOT NULL DEFAULT 'CV',
    "source" "CandidateDocumentSource" NOT NULL,
    "originalName" VARCHAR(255) NOT NULL,
    "mimeType" VARCHAR(150) NOT NULL,
    "size" INTEGER NOT NULL,
    "storageKey" VARCHAR(500) NOT NULL,
    "objectETag" VARCHAR(255),
    "checksumSha256" VARCHAR(64),
    "candidateId" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "candidate_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_parse_jobs" (
    "id" TEXT NOT NULL,
    "status" "CvParseJobStatus" NOT NULL DEFAULT 'QUEUED',
    "candidateDocumentId" TEXT NOT NULL,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_parse_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_parse_results" (
    "id" TEXT NOT NULL,
    "parseJobId" TEXT NOT NULL,
    "fullName" VARCHAR(100),
    "headline" VARCHAR(200),
    "summary" TEXT,
    "totalExperienceYears" INTEGER,
    "skills" JSONB,
    "education" JSONB,
    "certifications" JSONB,
    "languages" JSONB,
    "extractedKeywords" JSONB,
    "reviewStatus" "CvReviewStatus" NOT NULL DEFAULT 'UNREVIEWED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_parse_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidate_search_profiles" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "searchableText" TEXT NOT NULL,
    "skills" TEXT[],
    "keywords" TEXT[],
    "totalExperienceYears" INTEGER,
    "highestEducation" VARCHAR(150),
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "candidate_search_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "candidate_documents_candidateId_idx" ON "candidate_documents"("candidateId");

-- CreateIndex
CREATE INDEX "candidate_documents_storageKey_idx" ON "candidate_documents"("storageKey");

-- CreateIndex
CREATE INDEX "candidate_documents_checksumSha256_idx" ON "candidate_documents"("checksumSha256");

-- CreateIndex
CREATE INDEX "cv_parse_jobs_candidateDocumentId_idx" ON "cv_parse_jobs"("candidateDocumentId");

-- CreateIndex
CREATE INDEX "cv_parse_jobs_status_idx" ON "cv_parse_jobs"("status");

-- CreateIndex
CREATE INDEX "cv_parse_jobs_createdAt_idx" ON "cv_parse_jobs"("createdAt");

-- CreateIndex
CREATE INDEX "cv_parse_results_reviewStatus_idx" ON "cv_parse_results"("reviewStatus");

-- CreateIndex
CREATE UNIQUE INDEX "cv_parse_results_parseJobId_key" ON "cv_parse_results"("parseJobId");

-- CreateIndex
CREATE INDEX "candidate_search_profiles_candidateId_idx" ON "candidate_search_profiles"("candidateId");

-- CreateIndex
CREATE INDEX "candidate_search_profiles_totalExperienceYears_idx" ON "candidate_search_profiles"("totalExperienceYears");

-- CreateIndex
CREATE UNIQUE INDEX "candidate_search_profiles_candidateId_key" ON "candidate_search_profiles"("candidateId");

-- AddForeignKey
ALTER TABLE "candidate_documents" ADD CONSTRAINT "candidate_documents_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_parse_jobs" ADD CONSTRAINT "cv_parse_jobs_candidateDocumentId_fkey" FOREIGN KEY ("candidateDocumentId") REFERENCES "candidate_documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_parse_results" ADD CONSTRAINT "cv_parse_results_parseJobId_fkey" FOREIGN KEY ("parseJobId") REFERENCES "cv_parse_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_search_profiles" ADD CONSTRAINT "candidate_search_profiles_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
