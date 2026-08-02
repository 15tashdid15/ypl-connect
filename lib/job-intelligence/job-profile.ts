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

            "Required Skills:",

            ...(profile.requiredSkills ?? []),


            "Keywords:",

            ...(profile.keywords ?? []),


            "Education Requirement:",

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


        educationRequirement:
            profile.educationRequirement ?? null,


    };

}