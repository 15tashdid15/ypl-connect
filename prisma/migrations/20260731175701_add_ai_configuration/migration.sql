-- CreateEnum
CREATE TYPE "AIProvider" AS ENUM ('LOCAL', 'GEMINI', 'OPENAI');

-- CreateTable
CREATE TABLE "ai_configuration" (
    "id" TEXT NOT NULL,
    "provider" "AIProvider" NOT NULL DEFAULT 'LOCAL',
    "fallbackEnabled" BOOLEAN NOT NULL DEFAULT false,
    "fallbackProvider" "AIProvider",
    "confidenceThreshold" INTEGER NOT NULL DEFAULT 80,
    "dailyTokenLimit" INTEGER,
    "monthlyTokenLimit" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_configuration_pkey" PRIMARY KEY ("id")
);
