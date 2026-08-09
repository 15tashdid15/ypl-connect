import {
    generateMatchReasons,
} from "./matching";
import {
    semanticCandidateSearch,
} from "./semantic-search";


import {
    calculateHybridScore,
} from "./scoring";


import {
    calculateSkillMatch,
    calculateExperienceMatch,
} from "./matching";



export async function hybridCandidateSearch({

    query,

    requiredSkills = [],

    requiredExperience = 0,

}: {

    query: string;

    requiredSkills?: string[];

    requiredExperience?: number;

}) {


    const semanticResults =
        await semanticCandidateSearch(
            query,
        );
    const validCandidates =
        semanticResults.filter(
            (
                candidate,
            ) => candidate !== null,
        );

    return validCandidates.map(
        (candidate) => {


            const skillScore =
                calculateSkillMatch(
                    candidate.skills,
                    requiredSkills,
                );


            const experienceScore =
                calculateExperienceMatch(
                    candidate.experience,
                    requiredExperience,
                );


            const semanticScore =
                candidate.similarity *
                100;



            const finalScore =
                calculateHybridScore({

                    semanticScore,

                    skillScore,

                    experienceScore,

                });

            const matchReasons =
                generateMatchReasons({

                    semanticScore,

                    candidateSkills:
                        candidate.skills,

                    requiredSkills,

                    candidateExperience:
                        candidate.experience,

                    requiredExperience,

                });

            return {

                ...candidate,

                semanticScore:
                    Number(
                        semanticScore.toFixed(2),
                    ),

                skillScore,

                experienceScore,

                finalScore,
                matchReasons,

            };


        },
    )
        .sort(
            (a, b) =>
                b.finalScore -
                a.finalScore,
        );

}