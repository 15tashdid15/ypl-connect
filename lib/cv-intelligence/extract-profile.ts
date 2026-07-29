import type {
    CandidateProfileExtraction
} from "./types";

import { SKILL_DICTIONARY } from "./skill-dictionary";


export function extractCandidateProfile(
    text: string
): CandidateProfileExtraction {


    const lowerText =
        text.toLowerCase();



    const detectedSkills =
        Object.values(SKILL_DICTIONARY)
            .flat()
            .filter(skill =>
                lowerText.includes(skill)
            )
            .map(skill =>
                skill
            );



    const uniqueSkills =
        Array.from(
            new Set(detectedSkills)
        );



    return {

        skills: uniqueSkills,

        education: [],

        certifications: [],

        languages: [],

        keywords: uniqueSkills,

    };
}