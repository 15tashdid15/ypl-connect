import prisma from "@/lib/prisma";

import {
    generateEmbedding,
} from "@/lib/ai/embedding-provider";


import {
    cosineSimilarity,
} from "./vector";



export async function semanticCandidateSearch(
    query: string,
) {


    const queryEmbedding =
        await generateEmbedding(
            query,
        );


    const candidates =
        await prisma.candidateSearchProfile.findMany({

            include: {
                candidate: true,
            },




        });



    const results =
        candidates
            .map((candidate) => {


                const candidateEmbedding =
                    Array.isArray(candidate.embedding)
                        ? candidate.embedding as number[]
                        : [];


                if (candidateEmbedding.length === 0) {
                    return null;
                }


                const similarity =
                    cosineSimilarity(
                        queryEmbedding,
                        candidateEmbedding,
                    );


                return {

                    candidateId:
                        candidate.candidateId,

                    name:
                        candidate.candidate.fullName,

                    skills:
                        candidate.skills,

                    experience:
                        candidate.totalExperienceYears,


                    similarity:

                        Number(
                            similarity.toFixed(4),
                        ),

                };

            })


            .filter(
                Boolean,
            )

            .sort(
                (a, b) =>
                    b!.similarity -
                    a!.similarity,
            );


    return results.slice(
        0,
        10,
    );

}