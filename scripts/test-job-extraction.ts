import "dotenv/config";


import {
    getActiveAIProvider,
} from "@/lib/ai/router";



async function main() {


    const provider =
        await getActiveAIProvider();



    const jobDescription = `

Senior HR Executive

ABC Limited is looking for a Senior HR Executive.

Responsibilities:

- Manage payroll and employee records.
- Handle recruitment and talent acquisition.
- Maintain HRIS systems.
- Manage employee relations.
- Ensure compliance with Bangladesh Labour Law.

Requirements:

- Bachelor's degree in HR or Business Administration.
- Minimum 3 years of HR experience.
- Experience with payroll and HR operations.

`;



    const result =
        await provider.extractJobProfile(
            jobDescription,
        );



    console.log(
        JSON.stringify(
            result,
            null,
            2,
        ),
    );

}



main();