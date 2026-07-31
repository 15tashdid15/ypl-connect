



export function buildCandidateSearchProfile({
    fullName,
    headline,
    summary,
    skills,
    keywords,
    education,
    totalExperienceYears,
}: {
    fullName?: string | null;
    headline?: string | null;
    summary?: string | null;

    skills: string[];

    keywords: string[];

    education: any[];

    totalExperienceYears?: number | null;

}) {


    const searchableText = [
        fullName,
        headline,
        summary,
        ...skills,
        ...keywords,
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();



    const highestEducation =
        education.length > 0
            ? education[0]?.degree ?? null
            : null;



    return {

        searchableText,

        skills,

        keywords,

        totalExperienceYears:
            totalExperienceYears ?? null,

        highestEducation,

    };

}