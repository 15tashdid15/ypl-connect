export function calculateSkillMatch(
    candidateSkills: string[],
    requiredSkills: string[],
) {


    if (
        requiredSkills.length === 0
    ) {
        return 0;
    }


    const candidateText =
        candidateSkills
            .join(" ")
            .toLowerCase();



    const matched =
        requiredSkills.filter(
            skill =>
                candidateText.includes(
                    skill.toLowerCase(),
                ),
        );


    return Number(
        (
            matched.length /
            requiredSkills.length *
            100
        )
            .toFixed(2),
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



    const candidateSkillText =
        candidateSkills
            .join(" ")
            .toLowerCase();



    for (
        const skill of requiredSkills
    ) {

        if (
            candidateSkillText.includes(
                skill.toLowerCase(),
            )
        ) {

            reasons.push(
                `Matched skill: ${skill}`,
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