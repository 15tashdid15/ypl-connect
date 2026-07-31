import type {
    CVAIProvider,
} from "./provider";

import type {
    AIExtractedCandidateProfile,
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

}