import "dotenv/config";

import prisma from "@/lib/prisma";

import {
    buildCandidateSearchProfile,
} from "@/lib/ai/candidate-profile";

import {
    generateEmbedding,
} from "@/lib/ai/embedding-provider";


async function main() {

    const candidates =
        await prisma.candidate.findMany({

            include: {

                documents: {

                    include: {

                        parseJobs: {

                            include: {

                                result: true,

                            },

                        },

                    },

                },

            },

        });



    console.log(
        `Found ${candidates.length} candidates`,
    );


    for (const candidate of candidates) {


        const parseResult =
            candidate.documents
                .flatMap(
                    document =>
                        document.parseJobs,
                )
                .map(
                    job =>
                        job.result,
                )
                .find(
                    Boolean,
                );


        if (!parseResult) {

            console.log(
                "Skipping:",
                candidate.id,
            );

            continue;

        }



        const profile =
            buildCandidateSearchProfile({

                fullName:
                    parseResult.fullName,

                headline:
                    parseResult.headline,

                seniority:
                    parseResult.seniority,

                summary:
                    parseResult.summary,

                skills:
                    Array.isArray(parseResult.skills)
                        ? parseResult.skills as string[]
                        : [],

                keywords:
                    Array.isArray(parseResult.extractedKeywords)
                        ? parseResult.extractedKeywords as string[]
                        : [],

                education:
                    Array.isArray(parseResult.education)
                        ? parseResult.education as Record<string, unknown>[]
                        : [],

                totalExperienceYears:
                    parseResult.totalExperienceYears,

                experience:
                    Array.isArray(parseResult.experience)
                        ? parseResult.experience as any
                        : [],

            });



        const embedding =
            await generateEmbedding(
                profile.searchableText,
            );



        await prisma.candidateSearchProfile.upsert({

            where: {

                candidateId:
                    candidate.id,

            },

            update: {

                ...profile,

                embedding,

                lastUpdatedAt:
                    new Date(),

            },

            create: {

                candidateId:
                    candidate.id,

                ...profile,

                embedding,

            },

        });



        console.log(
            "Updated:",
            candidate.fullName,
        );

    }

}



main()
    .catch(console.error)
    .finally(
        async () =>
            await prisma.$disconnect(),
    );