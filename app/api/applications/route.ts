import { Prisma } from "@/app/generated/prisma/client";
import { getJobBySlug } from "@/data/jobs";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

const MAX_CV_SIZE = 5 * 1024 * 1024;

const allowedCvTypes = new Set([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const allowedCvExtensions = [".pdf", ".doc", ".docx"];

class DuplicateApplicationError extends Error {
    referenceId: string;

    constructor(referenceId: string) {
        super("This candidate has already applied for this job.");
        this.name = "DuplicateApplicationError";
        this.referenceId = referenceId;
    }
}

function getText(formData: FormData, key: string) {
    const value = formData.get(key);

    return typeof value === "string" ? value.trim() : "";
}

function hasAllowedExtension(filename: string) {
    const normalizedFilename = filename.toLowerCase();

    return allowedCvExtensions.some((extension) =>
        normalizedFilename.endsWith(extension),
    );
}

function createApplicationReference() {
    const referenceCode = crypto
        .randomUUID()
        .split("-")[0]
        .toUpperCase();

    return `YPL-${new Date().getFullYear()}-${referenceCode}`;
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        const honeypot = getText(formData, "website");

        if (honeypot) {
            return Response.json(
                {
                    message: "Application received.",
                },
                {
                    status: 201,
                },
            );
        }

        const jobSlug = getText(formData, "jobSlug");
        const submittedJobTitle = getText(formData, "jobTitle");
        const fullName = getText(formData, "fullName");
        const email = getText(formData, "email").toLowerCase();
        const phone = getText(formData, "phone");
        const location = getText(formData, "location");
        const currentCompany = getText(formData, "currentCompany");
        const experience = getText(formData, "experience");
        const portfolioUrl = getText(formData, "portfolioUrl");
        const coverLetter = getText(formData, "coverLetter");
        const consent = getText(formData, "consent");

        const cvValue = formData.get("cv");
        const cv = cvValue instanceof File ? cvValue : null;

        const errors: string[] = [];
        const job = getJobBySlug(jobSlug);

        if (!job) {
            errors.push("The selected job could not be found.");
        } else if (
            submittedJobTitle &&
            submittedJobTitle !== job.title
        ) {
            errors.push("The selected job information is invalid.");
        }

        if (fullName.length < 2 || fullName.length > 100) {
            errors.push("Enter a valid full name.");
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            errors.push("Enter a valid email address.");
        }

        if (phone.length < 7 || phone.length > 30) {
            errors.push("Enter a valid phone number.");
        }

        if (location.length < 2 || location.length > 100) {
            errors.push("Enter a valid current location.");
        }

        if (!experience) {
            errors.push("Select your experience.");
        }

        if (
            portfolioUrl &&
            !portfolioUrl.startsWith("https://") &&
            !portfolioUrl.startsWith("http://")
        ) {
            errors.push("Enter a valid portfolio or LinkedIn URL.");
        }

        if (coverLetter.length > 3000) {
            errors.push("The cover letter cannot exceed 3,000 characters.");
        }

        if (consent !== "on" && consent !== "true") {
            errors.push("You must provide consent before applying.");
        }

        if (!cv || cv.size === 0) {
            errors.push("Please upload your CV.");
        } else {
            if (cv.size > MAX_CV_SIZE) {
                errors.push("The CV must not exceed 5 MB.");
            }

            const allowedType =
                allowedCvTypes.has(cv.type) ||
                hasAllowedExtension(cv.name);

            if (!allowedType) {
                errors.push("The CV must be a PDF, DOC or DOCX file.");
            }
        }

        if (errors.length > 0 || !job || !cv) {
            return Response.json(
                {
                    message: "Please correct the application form.",
                    errors,
                },
                {
                    status: 400,
                },
            );
        }

        const referenceId = createApplicationReference();

        const existingCandidate = await prisma.candidate.findUnique({
            where: {
                email,
            },
            select: {
                applications: {
                    where: {
                        jobSlug: job.slug,
                    },
                    select: {
                        referenceId: true,
                    },
                    take: 1,
                },
            },
        });

        const existingApplication =
            existingCandidate?.applications[0];

        if (existingApplication) {
            throw new DuplicateApplicationError(
                existingApplication.referenceId,
            );
        }

        const applicationData = {
            referenceId,
            jobSlug: job.slug,
            jobTitle: job.title,
            coverLetter: coverLetter || null,
            cvOriginalName: cv.name,
            cvMimeType:
                cv.type || "application/octet-stream",
            cvSize: cv.size,
            cvStorageKey: null,
            consentAt: new Date(),
        };

        const candidateWithApplication =
            await prisma.candidate.upsert({
                where: {
                    email,
                },
                update: {
                    fullName,
                    phone,
                    location,
                    currentCompany: currentCompany || null,
                    experience,
                    portfolioUrl: portfolioUrl || null,
                    applications: {
                        create: applicationData,
                    },
                },
                create: {
                    fullName,
                    email,
                    phone,
                    location,
                    currentCompany: currentCompany || null,
                    experience,
                    portfolioUrl: portfolioUrl || null,
                    applications: {
                        create: applicationData,
                    },
                },
                select: {
                    applications: {
                        where: {
                            referenceId,
                        },
                        select: {
                            referenceId: true,
                            status: true,
                            createdAt: true,
                        },
                        take: 1,
                    },
                },
            });

        const application =
            candidateWithApplication.applications[0];

        if (!application) {
            throw new Error(
                "Application was not returned after creation.",
            );
        }
        return Response.json(
            {
                message: "Your application was submitted successfully.",
                applicationId: application.referenceId,
                status: application.status,
                submittedAt: application.createdAt,
            },
            {
                status: 201,
            },
        );
    } catch (error) {
        if (error instanceof DuplicateApplicationError) {
            return Response.json(
                {
                    message: "You have already applied for this position.",
                    applicationId: error.referenceId,
                },
                {
                    status: 409,
                },
            );
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.error("Prisma application error:", {
                code: error.code,
                meta: error.meta,
            });

            if (error.code === "P2002") {
                return Response.json(
                    {
                        message:
                            "A database uniqueness rule prevented this application. Check the candidate and application constraints.",
                    },
                    {
                        status: 409,
                    },
                );
            }

            return Response.json(
                {
                    message: `The database rejected the application (${error.code}).`,
                },
                {
                    status: 500,
                },
            );
        }

        console.error("Unexpected application error:", {
            name: error instanceof Error ? error.name : "UnknownError",
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown application error",
        });

        return Response.json(
            {
                message:
                    "The server could not save the application. Check the development terminal for the error code.",
            },
            {
                status: 500,
            },
        );
    }
}