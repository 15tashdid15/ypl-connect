export function buildJobExtractionPrompt(
    text: string,
) {


    return `

You are an expert recruitment AI.

Analyze the following job description.

Extract only reliable information.
For summary:
- Create a concise one or two sentence description of the job role.
- Summarize the main responsibilities and purpose of the position.
- Do not leave summary empty if the job description contains responsibilities.
Return ONLY valid JSON.

Required format:

{
 "title":"",
 "summary":"Short description of the role and responsibilities",
 "requiredSkills":[
    "Payroll",
    "HRIS",
    "Recruitment"
 ],
 "requiredExperienceYears":0,
 "educationRequirement":"",
 "keywords":[
    "HR",
    "Human Resources"
 ]
}


Rules:

Extract professional skills separately.

requiredSkills:
- Include every specific skill, technology, tool, domain expertise, or professional competency required for performing the job.
- Examples:
  Payroll, HRIS, Recruitment, Talent Acquisition, Employee Relations, React, Python, SQL, AutoCAD.

keywords:
- Include broader searchable terms related to the role.
- Do not put skills only in keywords.

Every skill mentioned in responsibilities or requirements must appear in requiredSkills.
- Calculate required experience from the job description.
- Ignore company marketing language.
- Do not invent missing information.


JOB DESCRIPTION:

${text}

`;

}
