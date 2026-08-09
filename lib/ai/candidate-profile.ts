import type {
    AIExperienceItem,
} from "./types";


function buildExperienceText(
    experience: AIExperienceItem[],
) {

    return experience
        .flatMap((item) => [

            item.role,

            item.company,

            ...(item.responsibilities ?? []),

            ...(item.achievements ?? []),

        ])
        .filter(Boolean)
        .join(" ");

}


function buildEducationText(
    education: Record<string, unknown>[],
) {

    return education
        .map((item) => {

            return Object.values(item)
                .filter(
                    value =>
                        typeof value === "string",
                )
                .join(" ");

        })
        .filter(Boolean)
        .join(" ");

}



export function buildCandidateSearchProfile({

    fullName,

    headline,

    seniority,

    summary,

    skills,

    keywords,

    education,

    totalExperienceYears,

    experience,

}: {

    fullName?: string | null;

    headline?: string | null;

    seniority?: string | null;

    summary?: string | null;

    skills: string[];

    keywords: string[];

    education: Record<string, unknown>[];

    totalExperienceYears?: number | null;

    experience: AIExperienceItem[];

}) {


    const searchableText = [

        fullName,

        headline,

        summary,
        seniority,

        "Skills:",

        ...skills,

        "Keywords:",

        ...keywords,

        "Experience:",

        buildExperienceText(
            experience,
        ),

        "Education:",

        buildEducationText(
            education,
        ),

        totalExperienceYears
            ? `${totalExperienceYears} years experience`
            : null,

    ]

        .filter(Boolean)

        .join(" ")

        .toLowerCase();



    const highestEducation =
        education.length > 0 &&
            typeof education[0]?.degree === "string"
            ? education[0].degree
            : null;



    return {

        searchableText,

        skills,

        keywords,

        seniority:
            seniority ?? null,

        totalExperienceYears:
            totalExperienceYears ?? null,

        highestEducation,

    };

}