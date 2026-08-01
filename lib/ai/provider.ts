import type {
    AIExtractedCandidateProfile,
    AIExtractedJobProfile,
} from "./types";


export interface CVAIProvider {

    extractCandidateProfile(
        text: string,
    ): Promise<AIExtractedCandidateProfile>;


    extractJobProfile(
        text: string,
    ): Promise<AIExtractedJobProfile>;

}