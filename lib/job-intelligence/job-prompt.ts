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
 "summary":"",
 "responsibilities":[
    ""
 ],
 "requiredSkills":[
    ""
 ],
 "preferredSkills":[
    ""
 ],
 "requiredExperienceYears":0,
 "seniority":"",
 "domain":"",
 "educationRequirement":"",
 "keywords":[
    ""
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

Extraction rules:

responsibilities:
- Extract actual duties and activities performed in the role.
- Convert long sentences into concise responsibility statements.

requiredSkills:
- Extract mandatory skills required to perform the job.

preferredSkills:
- Extract optional or desirable skills.

seniority:
- Determine level such as:
  Intern, Junior, Executive, Senior, Manager, Lead, Director.

domain:
- Identify professional domain:
  HR, Finance, Engineering, Marketing, IT, etc.

Do not invent information.

JOB DESCRIPTION:

${text}

`;

}
