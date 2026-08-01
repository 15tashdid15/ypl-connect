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

    summary?: string;

    totalExperienceYears?: number;


    skills: string[];

    education: string[];

    certifications: string[];

    languages: string[];

    extractedKeywords: string[];


    experience: AIExperienceItem[];

};
export type AIExtractedJobProfile = {

    title?: string;

    summary?: string;

    requiredSkills: string[];

    requiredExperienceYears?: number;

    educationRequirement?: string;

    keywords: string[];

};