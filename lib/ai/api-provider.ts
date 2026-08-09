import type {
    CVAIProvider,
} from "./provider";


import type {
    AIExtractedCandidateProfile,
    AIExtractedJobProfile,
} from "./types";


export class APIAIProvider
    implements CVAIProvider {


    async extractCandidateProfile(
        text: string,
    ): Promise<AIExtractedCandidateProfile> {


        return {

            skills: [],

            education: [],

            certifications: [],

            languages: [],

            experience: [],

            extractedKeywords: [],

        };

    }



    async extractJobProfile(
        text: string,
    ): Promise<AIExtractedJobProfile> {


        return {
            responsibilities: [],

            requiredSkills: [],

            preferredSkills: [],

            keywords: [],
        };

    }

}