-- CreateTable
CREATE TABLE "recruiter_candidate_actions" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "action" VARCHAR(50) NOT NULL,
    "note" TEXT,
    "recruiterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recruiter_candidate_actions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "recruiter_candidate_actions_jobId_idx" ON "recruiter_candidate_actions"("jobId");

-- CreateIndex
CREATE INDEX "recruiter_candidate_actions_candidateId_idx" ON "recruiter_candidate_actions"("candidateId");

-- CreateIndex
CREATE UNIQUE INDEX "recruiter_candidate_actions_jobId_candidateId_recruiterId_key" ON "recruiter_candidate_actions"("jobId", "candidateId", "recruiterId");

-- AddForeignKey
ALTER TABLE "recruiter_candidate_actions" ADD CONSTRAINT "recruiter_candidate_actions_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recruiter_candidate_actions" ADD CONSTRAINT "recruiter_candidate_actions_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
