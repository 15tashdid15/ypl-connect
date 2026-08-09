-- CreateTable
CREATE TABLE "cv_extracted_texts" (
    "id" TEXT NOT NULL,
    "parseJobId" TEXT NOT NULL,
    "extractedText" TEXT NOT NULL,
    "extractionMethod" VARCHAR(50) NOT NULL,
    "pageCount" INTEGER,
    "characterCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_extracted_texts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cv_extracted_texts_characterCount_idx" ON "cv_extracted_texts"("characterCount");

-- CreateIndex
CREATE UNIQUE INDEX "cv_extracted_texts_parseJobId_key" ON "cv_extracted_texts"("parseJobId");

-- AddForeignKey
ALTER TABLE "cv_extracted_texts" ADD CONSTRAINT "cv_extracted_texts_parseJobId_fkey" FOREIGN KEY ("parseJobId") REFERENCES "cv_parse_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
