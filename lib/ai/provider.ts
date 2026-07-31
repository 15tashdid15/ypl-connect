import type {
    AIExtractedCandidateProfile,
} from "./types";


export interface CVAIProvider {

    extractCandidateProfile(
        text: string,
    ): Promise<AIExtractedCandidateProfile>;

}