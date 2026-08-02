export type AIExperienceItem = {

    company?: string;

    role?: string;

    startDate?: string;

    endDate?: string;

    responsibilities: string[];

    achievements: string[];

};
export type AIExtractedCandidateProfile = {

    fullName?: string;

    headline?: string;
    seniority?: string;

    summary?: string;

    totalExperienceYears?: number;


    skills: string[];

    education: Record<string, unknown>[];

    certifications: unknown[];

    languages: unknown[];

    extractedKeywords: string[];


    experience: AIExperienceItem[];

};
export type AIExtractedJobProfile = {

    title?: string;

    summary?: string;


    responsibilities: string[];


    requiredSkills: string[];


    preferredSkills: string[];


    requiredExperienceYears?: number;


    seniority?: string;


    domain?: string;


    educationRequirement?: string;


    keywords: string[];

};