import type {
    CVAIProvider,
} from "./provider";


import type {
    AIExtractedCandidateProfile,
} from "./types";


import {
    askOllama,
} from "./ollama-client";



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
- Do not include generic words unless they represent a real skill.

Return ONLY valid JSON.

Required format:

{
  "fullName": "",
  "headline": "",
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


        const profile =
            JSON.parse(
                cleaned,
            );

        const normalizedProfile: AIExtractedCandidateProfile = {

            fullName:
                profile.fullName ?? undefined,

            headline:
                profile.headline ?? undefined,

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

                        company: item.company ?? "",

                        role: item.role ?? "",

                        startDate: item.startDate ?? "",

                        endDate: item.endDate ?? "",

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

    }

}