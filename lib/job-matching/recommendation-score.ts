import {
    calculateHybridScore,
} from "@/lib/candidate-search/scoring";


import {
    calculateSkillMatch,
    calculateExperienceMatch,
    generateMatchReasons,
} from "@/lib/candidate-search/matching";

import {
    calculateSeniorityMatch,
} from "@/lib/candidate-search/seniority-matching";

export function calculateRecommendationScore({

    similarity,

    candidateSkills,

    requiredSkills,

    candidateExperience,

    requiredExperience,

    candidateSeniority,

    requiredSeniority,

}: {

    similarity: number;

    candidateSkills: string[];

    requiredSkills: string[];

    candidateExperience: number | null;

    requiredExperience: number;
    candidateSeniority?: string | null;

    requiredSeniority?: string | null;

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

    const seniorityScore =
        calculateSeniorityMatch({

            candidateSeniority,

            requiredSeniority,

        });

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
        seniorityScore,
        finalScore,

        reasons,

    };

}