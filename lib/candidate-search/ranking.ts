export function calculateCandidateScore({

    candidateSkills,

    candidateKeywords,

    candidateExperience,

    query,

}: {

    candidateSkills: string[];

    candidateKeywords: string[];

    candidateExperience: number | null;

    query: string;

}) {


    const normalizedQuery =
        query
            .toLowerCase()
            .split(" ")
            .filter(Boolean);



    let skillScore = 0;

    let keywordScore = 0;
    const reasons: string[] = [];



    const skillsText =
        candidateSkills
            .join(" ")
            .toLowerCase();


    const keywordsText =
        candidateKeywords
            .join(" ")
            .toLowerCase();



    for (const word of normalizedQuery) {


        if (skillsText.includes(word)) {

            skillScore += 1;

            reasons.push(
                `Matched skill: ${word}`
            );

        }


        if (keywordsText.includes(word)) {

            keywordScore += 1;

        }

    }



    const skillMatch =
        normalizedQuery.length > 0
            ? skillScore / normalizedQuery.length
            : 0;



    const keywordMatch =
        normalizedQuery.length > 0
            ? keywordScore / normalizedQuery.length
            : 0;



    let experienceScore = 0;


    if (
        candidateExperience &&
        candidateExperience >= 5
    ) {

        experienceScore = 1;

        reasons.push(
            "5+ years experience"
        );

    }

    else if (
        candidateExperience &&
        candidateExperience >= 3
    ) {

        experienceScore = 0.7;

    }

    else if (
        candidateExperience &&
        candidateExperience >= 1
    ) {

        experienceScore = 0.4;

    }



    const finalScore =

        (skillMatch * 40) +

        (keywordMatch * 25) +

        (experienceScore * 25) +

        (10);



    return {

        score:
            Math.round(finalScore),

        reasons,

    };

}