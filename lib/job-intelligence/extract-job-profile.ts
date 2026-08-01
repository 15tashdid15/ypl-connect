import {
    getActiveAIProvider,
} from "@/lib/ai/router";


import {
    buildJobExtractionPrompt,
} from "./job-prompt";


import type {
    AIExtractedJobProfile,
} from "./types";



function cleanJsonResponse(
    response: string,
) {

    return response
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

}



export async function extractJobProfile(
    text: string,
): Promise<AIExtractedJobProfile> {


    const provider =
        await getActiveAIProvider();



    const response =
        await provider.extractCandidateProfile(
            buildJobExtractionPrompt(text),
        );



    const cleaned =
        cleanJsonResponse(
            JSON.stringify(response),
        );


    const profile =
        JSON.parse(
            cleaned,
        );



    return {

        title:
            profile.title,


        summary:
            profile.summary,


        requiredSkills:
            Array.isArray(profile.requiredSkills)
                ? profile.requiredSkills
                : [],


        requiredExperienceYears:
            profile.requiredExperienceYears,


        educationRequirement:
            profile.educationRequirement,


        keywords:
            Array.isArray(profile.keywords)
                ? profile.keywords
                : [],

    };

}