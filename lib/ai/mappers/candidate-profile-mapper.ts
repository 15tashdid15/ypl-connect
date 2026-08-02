import type {
    AIExtractedCandidateProfile,
} from "../types";


export function mapCandidateProfileForPersistence(
    profile: AIExtractedCandidateProfile,
) {

    return {
        fullName:
            profile.fullName ?? null,

        headline:
            profile.headline ?? null,

        summary:
            profile.summary ?? null,

        totalExperienceYears:
            profile.totalExperienceYears ?? null,

        skills:
            profile.skills,

        education:
            JSON.parse(
                JSON.stringify(
                    profile.education,
                ),
            ),

        certifications:
            JSON.parse(
                JSON.stringify(
                    profile.certifications,
                ),
            ),

        languages:
            JSON.parse(
                JSON.stringify(
                    profile.languages,
                ),
            ),

        experience:
            JSON.parse(
                JSON.stringify(
                    profile.experience,
                ),
            ),

        extractedKeywords:
            profile.extractedKeywords,
    };
}