import prisma from "@/lib/prisma";
import {
    createCvDownloadUrl,
    CV_DOWNLOAD_URL_TTL_SECONDS,
} from "@/lib/r2";
import { getRecruiterSession } from "@/lib/recruiter-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(
    request: Request,
    context: RouteContext,
) {
    const session = await getRecruiterSession(request);

    if (!session) {
        return Response.json(
            {
                message: "Authentication is required.",
            },
            {
                status: 401,
                headers: {
                    "Cache-Control": "no-store",
                },
            },
        );
    }

    const { id } = await context.params;

    const application =
        await prisma.application.findUnique({
            where: {
                id,
            },
            select: {
                cvStorageKey: true,
                cvOriginalName: true,
                cvMimeType: true,
            },
        });

    if (!application?.cvStorageKey) {
        return Response.json(
            {
                message: "The CV could not be found.",
            },
            {
                status: 404,
                headers: {
                    "Cache-Control": "no-store",
                },
            },
        );
    }

    try {
        const downloadUrl = await createCvDownloadUrl({
            storageKey: application.cvStorageKey,
            originalFilename:
                application.cvOriginalName,
            contentType: application.cvMimeType,
        });

        return new Response(null, {
            status: 302,
            headers: {
                Location: downloadUrl,
                "Cache-Control": "private, no-store",
                "X-CV-Link-Expires-In":
                    CV_DOWNLOAD_URL_TTL_SECONDS.toString(),
            },
        });
    } catch (error) {
        console.error("CV download URL error:", {
            name:
                error instanceof Error
                    ? error.name
                    : "UnknownError",
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown R2 download error",
        });

        return Response.json(
            {
                message:
                    "The CV download could not be prepared.",
            },
            {
                status: 500,
                headers: {
                    "Cache-Control": "no-store",
                },
            },
        );
    }
}