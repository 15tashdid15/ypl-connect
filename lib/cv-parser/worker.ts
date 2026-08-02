import {
    mapCandidateProfileForPersistence,
} from "@/lib/ai/mappers/candidate-profile-mapper";
import {
    generateEmbedding,
} from "@/lib/ai/embedding-provider";
import {
    buildCandidateSearchProfile,
} from "@/lib/ai/candidate-profile";
import {
    getActiveAIProvider,
} from "@/lib/ai/router";
import prisma from "@/lib/prisma";
import { getCvObjectBuffer } from "@/lib/r2";
import { extractCvText } from "./extract";


export async function processCvParseJob(
    parseJobId: string,
) {
    const parseJob =
        await prisma.cvParseJob.findUnique({
            where: {
                id: parseJobId,
            },
            include: {
                candidateDocument: {
                    include: {
                        candidate: true,
                    },
                },
            },
        });


    if (!parseJob) {
        throw new Error(
            "CV parse job not found.",
        );
    }


    if (!parseJob.candidateDocument) {
        throw new Error(
            "Candidate document missing.",
        );
    }


    try {




        const document =
            parseJob.candidateDocument;
        const candidate =
            document.candidate;

        const buffer =
            await getCvObjectBuffer(
                document.storageKey,
            );


        const extracted =
            await extractCvText(
                buffer,
                document.mimeType,
            );


        await prisma.cvExtractedText.upsert({
            where: {
                parseJobId:
                    parseJob.id,
            },

            update: {
                extractedText:
                    extracted.text,

                extractionMethod:
                    document.mimeType === "application/pdf"
                        ? "PDF_PARSE"
                        : "DOCX_MAMMOTH",

                pageCount:
                    "pageCount" in extracted &&
                        typeof extracted.pageCount === "number"
                        ? extracted.pageCount
                        : null,

                characterCount:
                    extracted.text.length,
            },

            create: {
                parseJobId:
                    parseJob.id,

                extractedText:
                    extracted.text,

                extractionMethod:
                    document.mimeType === "application/pdf"
                        ? "PDF_PARSE"
                        : "DOCX_MAMMOTH",

                pageCount:
                    "pageCount" in extracted &&
                        typeof extracted.pageCount === "number"
                        ? extracted.pageCount
                        : null,

                characterCount:
                    extracted.text.length,
            },
        });

        const aiProvider =
            await getActiveAIProvider();


        const profile =
            await aiProvider.extractCandidateProfile(
                extracted.text,
            );
        const persistedProfile =
            mapCandidateProfileForPersistence(
                profile,
            );

        await prisma.cvParseResult.upsert({
            where: {
                parseJobId: parseJob.id,
            },
            update: persistedProfile,
            create: {
                parseJobId:
                    parseJob.id,

                ...persistedProfile,
            },
        });
        const searchProfile =
            buildCandidateSearchProfile({

                fullName:
                    profile.fullName,

                headline:
                    profile.headline,

                summary:
                    profile.summary,

                skills:
                    profile.skills,

                keywords:
                    profile.extractedKeywords,

                education:
                    profile.education,

                totalExperienceYears:
                    profile.totalExperienceYears,

                experience:
                    profile.experience,

            });
        const embedding =
            await generateEmbedding(
                searchProfile.searchableText,
            );

        await prisma.candidateSearchProfile.upsert({

            where: {
                candidateId:
                    candidate.id,
            },

            update: {

                ...searchProfile,

                embedding,

                lastUpdatedAt:
                    new Date(),

            },

            create: {

                candidateId:
                    candidate.id,

                ...searchProfile,

                embedding,

            },

        });
        await prisma.cvParseJob.update({
            where: {
                id: parseJob.id,
            },
            data: {
                status: "SUCCEEDED",
                completedAt: new Date(),
            },
        });


        return {
            success: true,
            characters:
                extracted.text.length,
        };


    } catch (error) {


        await prisma.cvParseJob.update({
            where: {
                id: parseJob.id,
            },
            data: {
                status: "FAILED",
                errorMessage:
                    error instanceof Error
                        ? error.message
                        : "Unknown error",
            },
        });


        throw error;
    }
}