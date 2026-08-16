import prisma from "@/lib/prisma";

import {
    findSemanticCandidates,
} from "./semantic-match";

import {
    calculateRecommendationScore,
} from "./recommendation-score";



export async function findRecommendedCandidates(
    jobId: string,
    recruiterId: string,
) {


    if (!jobId) {

        throw new Error(
            "Job ID is required for candidate recommendation.",
        );

    }



    const job =
        await prisma.jobSearchProfile.findUnique({

            where: {
                jobId,
            },

            include: {

                job: true,

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




        const recruiterAction =
            await prisma.recruiterCandidateAction.findUnique({

                where: {

                    jobId_candidateId_recruiterId: {

                        jobId,

                        candidateId:
                            candidate.candidateId,

                        recruiterId,

                    },

                },

            });


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


                candidateSeniority:
                    candidate.seniority,


                requiredSeniority:
                    job.seniority,

            });






        results.push({

            candidateId:
                candidate.candidateId,


            applicationId:
                null,


            name:
                candidate.candidate.fullName,


            currentAction:
                recruiterAction?.action ?? null,


            ...score,

        });


    }



    return results.sort(

        (a, b) =>
            b.finalScore -
            a.finalScore,

    );

}