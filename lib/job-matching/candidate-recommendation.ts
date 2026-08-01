import prisma from "@/lib/prisma";


import {
    findSemanticCandidates,
} from "./semantic-match";


import {
    calculateRecommendationScore,
} from "./recommendation-score";



export async function findRecommendedCandidates(
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
            "Job profile not found",
        );

    }



    const semanticCandidates =
        await findSemanticCandidates(
            jobId,
        );

    const validCandidates =
        semanticCandidates.filter(
            (
                item,
            ) => item !== null,
        );

    const results = [];



    for (
        const item of validCandidates
    ) {


        const candidate =
            await prisma.candidateSearchProfile.findUnique({

                where: {
                    candidateId:
                        item.candidateId,
                },

                include: {
                    candidate: true,
                },

            });



        if (!candidate) {

            continue;

        }



        const score =
            calculateRecommendationScore({

                similarity:
                    item.similarity,

                candidateSkills:
                    candidate.skills,

                requiredSkills:
                    job.requiredSkills,

                candidateExperience:
                    candidate.totalExperienceYears,

                requiredExperience:
                    job.requiredExperience ?? 0,

            });



        results.push({

            candidateId:
                candidate.candidateId,


            name:
                candidate.candidate.fullName,


            ...score,

        });

    }



    return results.sort(

        (a, b) =>
            b.finalScore -
            a.finalScore,

    );

}