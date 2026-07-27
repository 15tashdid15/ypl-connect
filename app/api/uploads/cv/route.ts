import {
    createCvStorageKey,
    MAX_CV_SIZE,
    resolveCvContentType,
} from "@/lib/cv";
import {
    createCvUploadUrl,
    CV_UPLOAD_URL_TTL_SECONDS,
} from "@/lib/r2";
import { getJobBySlug } from "@/data/jobs";

export const runtime = "nodejs";

type UploadRequestBody = {
    jobSlug?: unknown;
    fileName?: unknown;
    fileType?: unknown;
    fileSize?: unknown;
};

export async function POST(request: Request) {
    try {
        let body: UploadRequestBody;

        try {
            body = (await request.json()) as UploadRequestBody;
        } catch {
            return Response.json(
                {
                    message: "The upload request is invalid.",
                },
                {
                    status: 400,
                },
            );
        }

        const jobSlug =
            typeof body.jobSlug === "string"
                ? body.jobSlug.trim()
                : "";

        const fileName =
            typeof body.fileName === "string"
                ? body.fileName.trim()
                : "";

        const fileType =
            typeof body.fileType === "string"
                ? body.fileType.trim()
                : "";

        const fileSize =
            typeof body.fileSize === "number"
                ? body.fileSize
                : Number.NaN;

        const errors: string[] = [];
        const job = getJobBySlug(jobSlug);

        if (!job) {
            errors.push("The selected job could not be found.");
        }

        if (
            !fileName ||
            fileName.length > 255 ||
            fileName.includes("\0")
        ) {
            errors.push("The CV filename is invalid.");
        }

        if (
            !Number.isInteger(fileSize) ||
            fileSize <= 0 ||
            fileSize > MAX_CV_SIZE
        ) {
            errors.push("The CV must not exceed 5 MB.");
        }

        const contentType = resolveCvContentType(
            fileName,
            fileType,
        );

        if (!contentType) {
            errors.push("The CV must be a PDF, DOC or DOCX file.");
        }

        if (errors.length > 0 || !job || !contentType) {
            return Response.json(
                {
                    message: "The CV cannot be uploaded.",
                    errors,
                },
                {
                    status: 400,
                },
            );
        }

        const storageKey = createCvStorageKey(
            job.slug,
            fileName,
        );

        const uploadUrl = await createCvUploadUrl({
            storageKey,
            contentType,
        });

        return Response.json(
            {
                uploadUrl,
                storageKey,
                contentType,
                expiresIn: CV_UPLOAD_URL_TTL_SECONDS,
            },
            {
                status: 201,
            },
        );
    } catch (error) {
        console.error("CV upload authorization error:", {
            name:
                error instanceof Error
                    ? error.name
                    : "UnknownError",
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown upload error",
        });

        return Response.json(
            {
                message:
                    "The server could not prepare the CV upload.",
            },
            {
                status: 500,
            },
        );
    }
}