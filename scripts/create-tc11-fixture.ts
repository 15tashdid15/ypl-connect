import "dotenv/config";

import prisma from "@/lib/prisma";
import { generateEmbedding } from "@/lib/ai/embedding-provider";

const JOB_ID = "cmtnu3zdm00002cfqqhu50ec8";
const JOB_SLUG = "senior-hr-executive";
const JOB_TITLE = "Senior HR Executive";
const EMAIL = "candidate02@example.com";

async function main() {
    const skills = [
        "HRIS",
        "Payroll Management",
        "Talent Acquisition",
        "Employee Relations",
        "Labor Law Compliance",
        "HR Reporting",
        "Performance Management",
    ];

    const keywords = [...skills];

    const searchableText = [
        "Test Candidate 02",
        "Senior Human Resources Specialist",
        "Senior",
        "Human resources specialist with four years of experience",
        ...skills,
        "Bachelor of Business Administration",
        "Example Test Organization",
        "HR Specialist",
        "4 years experience",
    ]
        .join(" ")
        .toLowerCase();

    const embedding = await generateEmbedding(searchableText);

    const candidate = await prisma.candidate.upsert({
        where: {
            email: EMAIL,
        },
        update: {
            fullName: "Test Candidate 02",
            phone: "00000000001",
            location: "Test City",
            currentCompany: "Example Test Organization",
            experience: "3-5 years",
        },
        create: {
            id: "tc11-candidate-20260906-02",
            fullName: "Test Candidate 02",
            email: EMAIL,
            phone: "00000000001",
            location: "Test City",
            currentCompany: "Example Test Organization",
            experience: "3-5 years",
        },
    });

    await prisma.candidateSearchProfile.upsert({
        where: {
            candidateId: candidate.id,
        },
        update: {
            searchableText,
            skills,
            keywords,
            seniority: "Senior",
            totalExperienceYears: 4,
            highestEducation: "Bachelor of Business Administration",
            embedding,
            lastUpdatedAt: new Date(),
        },
        create: {
            candidateId: candidate.id,
            searchableText,
            skills,
            keywords,
            seniority: "Senior",
            totalExperienceYears: 4,
            highestEducation: "Bachelor of Business Administration",
            embedding,
            lastUpdatedAt: new Date(),
        },
    });

    const application = await prisma.application.upsert({
        where: {
            candidateId_jobSlug: {
                candidateId: candidate.id,
                jobSlug: JOB_SLUG,
            },
        },
        update: {
            jobTitle: JOB_TITLE,
            status: "APPLIED",
            coverLetter:
                "Synthetic application fixture created exclusively for TC-11 reject-action testing.",
            cvOriginalName: "Test_Candidate_02.docx",
            cvMimeType:
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            cvSize: 7339,
            cvStorageKey: null,
            consentAt: new Date(),
        },
        create: {
            id: "tc11-app-20260906-test-candidate-02",
            referenceId: "YPL-TC11-20260906",
            candidateId: candidate.id,
            jobSlug: JOB_SLUG,
            jobTitle: JOB_TITLE,
            status: "APPLIED",
            coverLetter:
                "Synthetic application fixture created exclusively for TC-11 reject-action testing.",
            cvOriginalName: "Test_Candidate_02.docx",
            cvMimeType:
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            cvSize: 7339,
            cvStorageKey: null,
            consentAt: new Date(),
        },
    });

    // Reset only this synthetic candidate's previous TC-11 action.
    await prisma.recruiterCandidateAction.deleteMany({
        where: {
            jobId: JOB_ID,
            candidateId: candidate.id,
        },
    });

    console.log("TC-11 FIXTURE READY");
    console.log(`Candidate: ${candidate.fullName}`);
    console.log(`Candidate ID: ${candidate.id}`);
    console.log(`Application ID: ${application.id}`);
    console.log(`Application status: ${application.status}`);
    console.log(`Embedding dimensions: ${embedding.length}`);
}

main()
    .catch((error) => {
        console.error("TC-11 FIXTURE FAILED");
        console.error(error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });