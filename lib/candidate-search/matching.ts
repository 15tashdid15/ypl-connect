import {
    normalizeSkill,
} from "@/lib/skill-intelligence/normalize-skill";

export function calculateSkillMatch(
    candidateSkills: string[],
    requiredSkills: string[],
): number {


    const normalizedCandidateSkills =
        candidateSkills.map(
            skill =>
                normalizeSkill(skill),
        );



    const normalizedRequiredSkills =
        requiredSkills.map(
            skill =>
                normalizeSkill(skill),
        );



    const matched =
        normalizedRequiredSkills.filter(
            required =>
                normalizedCandidateSkills.includes(
                    required,
                ),
        );



    if (
        normalizedRequiredSkills.length === 0
    ) {

        return 0;

    }



    return Math.round(
        (
            matched.length /
            normalizedRequiredSkills.length
        )
        *
        100
    );

}
export function calculateExperienceMatch(

    candidateExperience: number | null,

    requiredExperience: number,

) {


    if (
        !candidateExperience
    ) {
        return 0;
    }


    if (
        candidateExperience >= requiredExperience
    ) {

        return 100;

    }


    return Number(
        (
            candidateExperience /
            requiredExperience *
            100
        )
            .toFixed(2),
    );

}
export function generateMatchReasons({

    semanticScore,

    candidateSkills,

    requiredSkills,

    candidateExperience,

    requiredExperience,

}: {

    semanticScore: number;

    candidateSkills: string[];

    requiredSkills: string[];

    candidateExperience: number | null;

    requiredExperience: number;

}) {


    const reasons: string[] = [];


    if (
        semanticScore >= 70
    ) {

        reasons.push(
            "Strong semantic match with job requirement",
        );

    }

    else if (
        semanticScore >= 50
    ) {

        reasons.push(
            "Relevant semantic match with job requirement",
        );

    }



    for (
        const requiredSkill of requiredSkills
    ) {


        const normalizedRequiredSkill =
            normalizeSkill(
                requiredSkill,
            );


        const matchedCandidateSkill =
            candidateSkills.find(
                candidateSkill =>
                    normalizeSkill(
                        candidateSkill,
                    )
                    === normalizedRequiredSkill,
            );


        if (
            matchedCandidateSkill
        ) {

            reasons.push(
                `Matched skill: ${requiredSkill} (candidate: ${matchedCandidateSkill})`,
            );

        }

    }



    if (
        candidateExperience &&
        candidateExperience >= requiredExperience
    ) {

        reasons.push(
            "Experience requirement satisfied",
        );

    }



    return reasons;

}