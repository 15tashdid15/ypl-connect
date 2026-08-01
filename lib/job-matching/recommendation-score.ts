import {
    calculateHybridScore,
} from "@/lib/candidate-search/scoring";


import {
    calculateSkillMatch,
    calculateExperienceMatch,
    generateMatchReasons,
} from "@/lib/candidate-search/matching";



export function calculateRecommendationScore({

    similarity,

    candidateSkills,

    requiredSkills,

    candidateExperience,

    requiredExperience,

}: {

    similarity: number;

    candidateSkills: string[];

    requiredSkills: string[];

    candidateExperience: number | null;

    requiredExperience: number;

}) {


    const semanticScore =
        similarity * 100;



    const skillScore =
        calculateSkillMatch(
            candidateSkills,
            requiredSkills,
        );



    const experienceScore =
        calculateExperienceMatch(
            candidateExperience,
            requiredExperience,
        );



    const finalScore =
        calculateHybridScore({

            semanticScore,

            skillScore,

            experienceScore,

        });



    const reasons =
        generateMatchReasons({

            semanticScore,

            candidateSkills,

            requiredSkills,

            candidateExperience,

            requiredExperience,

        });



    return {

        semanticScore:
            Number(
                semanticScore.toFixed(2),
            ),

        skillScore,

        experienceScore,

        finalScore,

        reasons,

    };

}