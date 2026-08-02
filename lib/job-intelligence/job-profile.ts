import type {
    AIExtractedJobProfile,
} from "@/lib/ai/types";



export function buildJobSearchProfile(
    profile: AIExtractedJobProfile,
) {


    const searchableText =
        [

            profile.title,


            profile.summary,


            "Responsibilities:",

            ...(profile.responsibilities ?? []),


            "Required Skills:",

            ...(profile.requiredSkills ?? []),


            "Preferred Skills:",

            ...(profile.preferredSkills ?? []),


            "Domain:",

            profile.domain,


            "Seniority:",

            profile.seniority,


            "Keywords:",

            ...(profile.keywords ?? []),


            "Education:",

            profile.educationRequirement,


        ]

            .filter(Boolean)

            .join(" ")

            .toLowerCase();



    return {

        searchableText,


        requiredSkills:
            profile.requiredSkills ?? [],


        requiredExperience:
            profile.requiredExperienceYears ?? null,
        seniority:
            profile.seniority ?? null,


        educationRequirement:
            profile.educationRequirement ?? null,

    };

}