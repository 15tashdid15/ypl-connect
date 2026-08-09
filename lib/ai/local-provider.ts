import type {
    CVAIProvider,
} from "./provider";


import type {
    AIExtractedCandidateProfile,
    AIExtractedJobProfile,
} from "./types";


import {
    askOllama,
} from "./ollama-client";

import {
    buildJobExtractionPrompt,
} from "@/lib/job-intelligence/job-prompt";

import {
    validateCandidateProfile,
} from "./validators/candidate-profile-validator";

function buildCVExtractionPrompt(
    text: string,
) {

    return `
You are an expert recruitment AI.

Analyze the following candidate CV text.

Extract only reliable information.

Important rules:

- Calculate total professional experience from employment dates.
- Include full-time employment experience.
- Include internships separately.
- Ignore education dates when calculating experience.
- Return totalExperienceYears as a number.

- Extract every employment history entry.
- For each job include:
  - company name
  - job title
  - start date
  - end date
  - responsibilities
  - achievements
- Do not merge multiple jobs into one entry.

- Extract professional skills, tools, technologies, and HR/business skills.
- Determine candidate career level.
- Return seniority based on experience and job titles.

Use only:
Junior
Mid
Senior
Lead
Manager
Director

Examples:
0-2 years -> Junior
3-5 years -> Mid
5+ years -> Senior
Leadership roles -> Manager/Director

Do not guess if evidence is missing.
- Do not include generic words unless they represent a real skill.


Return ONLY valid JSON.

Required format:

{
  "fullName": "",
  "headline": "",
  "seniority": "",
  "summary": "",
  "totalExperienceYears": 0,
  "skills": [],
  "education": [],
  "certifications": [],
  "languages": [],
  "extractedKeywords": [],
  "experience": [
    {
      "company": "",
      "role": "",
      "startDate": "",
      "endDate": "",
      "responsibilities": [],
      "achievements": []
    }
  ]
}


CV TEXT:

${text}

`;

}



function cleanJsonResponse(
    response: string,
) {

    return response
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

}



export class LocalAIProvider
    implements CVAIProvider {


    async extractCandidateProfile(
        text: string,
    ): Promise<AIExtractedCandidateProfile> {


        const prompt =
            buildCVExtractionPrompt(
                text,
            );


        const response =
            await askOllama(
                prompt,
            );


        const cleaned =
            cleanJsonResponse(
                response,
            );


        const rawProfile =
            JSON.parse(
                cleaned,
            );


        const profile =
            validateCandidateProfile(
                rawProfile,
            );


        const normalizedProfile:
            AIExtractedCandidateProfile = {

            fullName:
                profile.fullName ?? undefined,

            headline:
                profile.headline ?? undefined,
            seniority:
                profile.seniority ?? undefined,
            summary:
                profile.summary ?? undefined,

            totalExperienceYears:
                profile.totalExperienceYears ?? undefined,

            skills:
                Array.isArray(profile.skills)
                    ? profile.skills
                    : [],

            education:
                Array.isArray(profile.education)
                    ? profile.education
                    : [],

            certifications:
                Array.isArray(profile.certifications)
                    ? profile.certifications
                    : [],

            languages:
                Array.isArray(profile.languages)
                    ? profile.languages
                    : [],

            extractedKeywords:
                Array.isArray(profile.extractedKeywords)
                    ? profile.extractedKeywords
                    : [],

            experience:
                Array.isArray(profile.experience)
                    ? profile.experience.map((item: any) => ({

                        company:
                            item.company ?? "",

                        role:
                            item.role ?? "",

                        startDate:
                            item.startDate ?? "",

                        endDate:
                            item.endDate ?? "",

                        responsibilities:
                            Array.isArray(item.responsibilities)
                                ? item.responsibilities
                                : [],

                        achievements:
                            Array.isArray(item.achievements)
                                ? item.achievements
                                : [],

                    }))
                    : [],

        };


        return normalizedProfile;

    } // <-- extractCandidateProfile ends here



    async extractJobProfile(
        text: string,
    ): Promise<AIExtractedJobProfile> {


        const prompt =
            buildJobExtractionPrompt(
                text,
            );


        const response =
            await askOllama(
                prompt,
            );


        const cleaned =
            cleanJsonResponse(
                response,
            );


        const profile =
            JSON.parse(
                cleaned,
            );


        return {

            title:
                profile.title ?? undefined,


            summary:
                profile.summary ?? undefined,


            responsibilities:
                Array.isArray(profile.responsibilities)
                    ? profile.responsibilities
                    : [],


            requiredSkills:
                Array.isArray(profile.requiredSkills)
                    ? profile.requiredSkills
                    : [],


            preferredSkills:
                Array.isArray(profile.preferredSkills)
                    ? profile.preferredSkills
                    : [],


            requiredExperienceYears:
                profile.requiredExperienceYears ?? undefined,


            seniority:
                profile.seniority ?? undefined,


            domain:
                profile.domain ?? undefined,


            educationRequirement:
                profile.educationRequirement ?? undefined,


            keywords:
                Array.isArray(profile.keywords)
                    ? profile.keywords
                    : [],

        };

    } // <-- extractJobProfile ends here


}