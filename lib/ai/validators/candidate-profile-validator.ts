import { z } from "zod";


const ExperienceItemSchema =
    z.object({
        company:
            z.string()
                .default(""),

        role:
            z.string()
                .default(""),

        startDate:
            z.string()
                .default(""),

        endDate:
            z.string()
                .default(""),

        responsibilities:
            z.array(z.string())
                .default([]),

        achievements:
            z.array(z.string())
                .default([]),
    });


export const CandidateProfileSchema =
    z.object({

        fullName:
            z.string()
                .optional(),

        headline:
            z.string()
                .optional(),

        summary:
            z.string()
                .optional(),

        totalExperienceYears:
            z.number()
                .nonnegative()
                .optional(),

        skills:
            z.array(z.string())
                .default([]),

        education:
            z.array(z.record(z.string(), z.unknown()))
                .default([]),

        certifications:
            z.array(z.unknown())
                .default([]),

        languages:
            z.array(z.unknown())
                .default([]),

        extractedKeywords:
            z.array(z.string())
                .default([]),

        experience:
            z.array(ExperienceItemSchema)
                .default([]),
    });


export type ValidatedCandidateProfile =
    z.infer<
        typeof CandidateProfileSchema
    >;


export function validateCandidateProfile(
    data: unknown,
): ValidatedCandidateProfile {

    return CandidateProfileSchema.parse(
        data,
    );

}