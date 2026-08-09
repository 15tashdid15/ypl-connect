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

ABC Limited is looking for a Senior HR Executive to manage
human resource operations and employee lifecycle activities.

Responsibilities:

- Manage monthly payroll processing and employee benefits.
- Handle recruitment, sourcing, interviewing and onboarding.
- Maintain HRIS and employee records.
- Manage employee relations and grievance handling.
- Ensure compliance with Bangladesh Labour Law.
- Prepare HR reports and workforce analytics.

Required Skills:

- Payroll Management
- HRIS
- Talent Acquisition
- Employee Relations
- Labor Law Compliance
- HR Reporting

Preferred Skills:

- HR Analytics
- Advanced Excel
- Performance Management

Requirements:

- Bachelor's degree in HR, Business Administration or related field.
- Minimum 3 years experience in HR operations.

Seniority:
Senior Executive

Domain:
Human Resources

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