import "dotenv/config";


import prisma from "@/lib/prisma";


import {
    getActiveAIProvider,
} from "@/lib/ai/router";


import {
    saveJobSearchProfile,
} from "@/lib/job-intelligence/save-job-profile";



async function main() {


    const provider =
        await getActiveAIProvider();



    const jobDescription = `

Senior HR Executive

ABC Limited is hiring a Senior HR Executive.

Responsibilities:
- Manage payroll operations.
- Handle recruitment and talent acquisition.
- Maintain HRIS records.
- Manage employee relations.

Requirements:
- Bachelor's degree in HR or Business Administration.
- Minimum 3 years experience.
- Knowledge of Bangladesh Labour Law.

`;



    const profile =
        await provider.extractJobProfile(
            jobDescription,
        );



    console.log(
        "AI Job Profile:",
    );


    console.log(
        profile,
    );



    const job =
        await prisma.job.create({

            data: {

                title:
                    profile.title ??
                    "Unknown Job",


                description:
                    jobDescription,


                companyName:
                    "ABC Limited",


                location:
                    "Dhaka",


                experienceRequired:
                    profile.requiredExperienceYears,

            },

        });



    const savedProfile =
        await saveJobSearchProfile({

            jobId:
                job.id,

            profile,

        });



    console.log(
        "Saved Job Search Profile:",
    );


    console.log(
        savedProfile,
    );


}


main();