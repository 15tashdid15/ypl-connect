import {
    findRecommendedCandidates,
} from "./candidate-recommendation";


export async function getCandidateRecommendations(
    jobId: string,
    recruiterId: string,
) {

    if (!jobId) {

        throw new Error(
            "Job ID is required to generate recommendations.",
        );

    }


    const recommendations =
        await findRecommendedCandidates(
            jobId,
            recruiterId,
        );


    return recommendations;

}