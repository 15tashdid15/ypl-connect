import { Prisma } from "@/app/generated/prisma/client";
import { getJobBySlug } from "@/data/jobs";
import {
    isValidCvStorageKey,
    MAX_CV_SIZE,
    resolveCvContentType,
} from "@/lib/cv";
import prisma from "@/lib/prisma";
import {
    deleteCvObject,
    getCvObjectMetadata,
} from "@/lib/r2";

export const runtime = "nodejs";

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

function createApplicationReference() {
    const referenceCode = crypto
        .randomUUID()
        .split("-")[0]
        .toUpperCase();

    return `YPL-${new Date().getFullYear()}-${referenceCode}`;
}

function normalizeContentType(contentType?: string) {
    return contentType
        ?.split(";")[0]
        .trim()
        .toLowerCase();
}

async function safelyDeleteCv(storageKey: string) {
    try {
        await deleteCvObject(storageKey);
    } catch (error) {
        console.error("Could not remove unused CV object:", {
            storageKey,
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown R2 deletion error",
        });
    }
}

export async function POST(request: Request) {
    let uploadedStorageKey = "";
    let uploadedObjectVerified = false;
    let applicationSaved = false;

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
        const submittedJobTitle = getText(
            formData,
            "jobTitle",
        );
        const fullName = getText(formData, "fullName");
        const email = getText(formData, "email").toLowerCase();
        const phone = getText(formData, "phone");
        const location = getText(formData, "location");
        const currentCompany = getText(
            formData,
            "currentCompany",
        );
        const experience = getText(formData, "experience");
        const portfolioUrl = getText(
            formData,
            "portfolioUrl",
        );
        const coverLetter = getText(
            formData,
            "coverLetter",
        );
        const consent = getText(formData, "consent");

        uploadedStorageKey = getText(
            formData,
            "cvStorageKey",
        );

        const cvOriginalName = getText(
            formData,
            "cvOriginalName",
        );
        const submittedCvMimeType = getText(
            formData,
            "cvMimeType",
        );
        const cvSizeText = getText(formData, "cvSize");
        const cvSize = Number(cvSizeText);

        const errors: string[] = [];
        const job = getJobBySlug(jobSlug);

        if (!job) {
            errors.push(
                "The selected job could not be found.",
            );
        } else if (
            submittedJobTitle &&
            submittedJobTitle !== job.title
        ) {
            errors.push(
                "The selected job information is invalid.",
            );
        }

        if (fullName.length < 2 || fullName.length > 100) {
            errors.push("Enter a valid full name.");
        }

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            errors.push("Enter a valid email address.");
        }

        if (phone.length < 7 || phone.length > 30) {
            errors.push("Enter a valid phone number.");
        }

        if (
            location.length < 2 ||
            location.length > 100
        ) {
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
            errors.push(
                "Enter a valid portfolio or LinkedIn URL.",
            );
        }

        if (coverLetter.length > 3000) {
            errors.push(
                "The cover letter cannot exceed 3,000 characters.",
            );
        }

        if (consent !== "on" && consent !== "true") {
            errors.push(
                "You must provide consent before applying.",
            );
        }

        if (
            !cvOriginalName ||
            cvOriginalName.length > 255 ||
            cvOriginalName.includes("\0")
        ) {
            errors.push("The CV filename is invalid.");
        }

        if (
            !Number.isInteger(cvSize) ||
            cvSize <= 0 ||
            cvSize > MAX_CV_SIZE
        ) {
            errors.push("The CV must not exceed 5 MB.");
        }

        const resolvedCvMimeType = resolveCvContentType(
            cvOriginalName,
            submittedCvMimeType,
        );

        if (!resolvedCvMimeType) {
            errors.push(
                "The CV must be a PDF, DOC or DOCX file.",
            );
        }

        const validStorageKey =
            Boolean(job) &&
            isValidCvStorageKey(
                uploadedStorageKey,
                jobSlug,
            );

        if (!validStorageKey) {
            errors.push(
                "The uploaded CV reference is invalid.",
            );
        }

        /*
         * Verify that the object really exists in the private
         * bucket and that its size and MIME type match the
         * metadata submitted by the browser.
         */
        if (
            job &&
            validStorageKey &&
            resolvedCvMimeType &&
            Number.isInteger(cvSize) &&
            cvSize > 0 &&
            cvSize <= MAX_CV_SIZE
        ) {
            try {
                const objectMetadata =
                    await getCvObjectMetadata(
                        uploadedStorageKey,
                    );

                const storedContentType =
                    normalizeContentType(
                        objectMetadata.ContentType,
                    );

                const submittedContentType =
                    normalizeContentType(
                        resolvedCvMimeType,
                    );

                if (objectMetadata.ContentLength !== cvSize) {
                    errors.push(
                        "The uploaded CV size does not match the submitted file.",
                    );
                }

                if (
                    !storedContentType ||
                    storedContentType !==
                    submittedContentType
                ) {
                    errors.push(
                        "The uploaded CV format could not be verified.",
                    );
                }

                if (
                    objectMetadata.ContentLength === cvSize &&
                    storedContentType === submittedContentType
                ) {
                    uploadedObjectVerified = true;
                }
            } catch {
                errors.push(
                    "The uploaded CV could not be found or verified.",
                );
            }
        }

        if (
            errors.length > 0 ||
            !job ||
            !resolvedCvMimeType ||
            !uploadedObjectVerified
        ) {
            if (uploadedObjectVerified) {
                await safelyDeleteCv(uploadedStorageKey);
                uploadedObjectVerified = false;
            }

            return Response.json(
                {
                    message:
                        "Please correct the application form.",
                    errors,
                },
                {
                    status: 400,
                },
            );
        }

        const referenceId =
            createApplicationReference();

        const existingCandidate =
            await prisma.candidate.findUnique({
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
            cvOriginalName,
            cvMimeType: resolvedCvMimeType,
            cvSize,
            cvStorageKey: uploadedStorageKey,
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
                    currentCompany:
                        currentCompany || null,
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
                    currentCompany:
                        currentCompany || null,
                    experience,
                    portfolioUrl: portfolioUrl || null,
                    applications: {
                        create: applicationData,
                    },
                },
                select: {
                    id: true,

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
        const candidateDocument =
            await prisma.candidateDocument.create({
                data: {
                    type: "CV",
                    source: "APPLICATION_UPLOAD",

                    originalName: cvOriginalName,
                    mimeType: resolvedCvMimeType,
                    size: cvSize,

                    storageKey: uploadedStorageKey,

                    candidateId:
                        candidateWithApplication.id,
                },
            });


        await prisma.cvParseJob.create({
            data: {
                candidateDocumentId:
                    candidateDocument.id,

                status: "QUEUED",
            },
        });
        applicationSaved = true;

        return Response.json(
            {
                message:
                    "Your application was submitted successfully.",
                applicationId:
                    application.referenceId,
                status: application.status,
                submittedAt: application.createdAt,
            },
            {
                status: 201,
            },
        );
    } catch (error) {
        if (
            uploadedObjectVerified &&
            !applicationSaved &&
            uploadedStorageKey
        ) {
            await safelyDeleteCv(uploadedStorageKey);
        }

        if (error instanceof DuplicateApplicationError) {
            return Response.json(
                {
                    message:
                        "You have already applied for this position.",
                    applicationId: error.referenceId,
                },
                {
                    status: 409,
                },
            );
        }

        if (
            error instanceof
            Prisma.PrismaClientKnownRequestError
        ) {
            console.error("Prisma application error:", {
                code: error.code,
                meta: error.meta,
            });

            if (error.code === "P2002") {
                return Response.json(
                    {
                        message:
                            "An application already exists for this candidate and job.",
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
            name:
                error instanceof Error
                    ? error.name
                    : "UnknownError",
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown application error",
        });

        return Response.json(
            {
                message:
                    "The server could not save the application. Please try again.",
            },
            {
                status: 500,
            },
        );
    }
}