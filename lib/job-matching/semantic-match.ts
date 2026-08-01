import prisma from "@/lib/prisma";


import {
    cosineSimilarity,
} from "@/lib/candidate-search/vector";



export async function findSemanticCandidates(
    jobId: string,
) {


    const job =
        await prisma.jobSearchProfile.findUnique({

            where: {
                jobId,
            },

        });



    if (!job) {
        throw new Error(
            "Job search profile not found",
        );
    }



    const candidates =
        await prisma.candidateSearchProfile.findMany();



    const results =
        candidates
            .map(candidate => {


                if (
                    !job.embedding ||
                    !candidate.embedding
                ) {

                    return null;

                }


                const similarity =
                    cosineSimilarity(
                        job.embedding as number[],
                        candidate.embedding as number[],
                    );



                return {

                    candidateId:
                        candidate.candidateId,

                    similarity,

                };


            })
            .filter(Boolean);



    return results
        .sort(
            (a: any, b: any) =>
                b.similarity -
                a.similarity,
        );

}