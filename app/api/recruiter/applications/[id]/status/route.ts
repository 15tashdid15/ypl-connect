import { revalidatePath } from "next/cache";

import {
    getApplicationStatusLabel,
    isApplicationStatus,
} from "@/lib/application-status";
import prisma from "@/lib/prisma";
import { getRecruiterSession } from "@/lib/recruiter-session";

export const runtime = "nodejs";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

type StatusRequestBody = {
    status?: unknown;
    comment?: unknown;
};

export async function PATCH(
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
            },
        );
    }

    const { id } = await context.params;

    let body: StatusRequestBody;

    try {
        body = (await request.json()) as StatusRequestBody;
    } catch {
        return Response.json(
            {
                message: "The status request is invalid.",
            },
            {
                status: 400,
            },
        );
    }

    if (!isApplicationStatus(body.status)) {
        return Response.json(
            {
                message: "Select a valid application status.",
            },
            {
                status: 400,
            },
        );
    }

    const comment =
        typeof body.comment === "string"
            ? body.comment.trim()
            : "";

    if (comment.length > 2000) {
        return Response.json(
            {
                message:
                    "The status comment cannot exceed 2,000 characters.",
            },
            {
                status: 400,
            },
        );
    }

    const existingApplication =
        await prisma.application.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                status: true,
                candidateId: true,
            },
        });

    if (!existingApplication) {
        return Response.json(
            {
                message: "The application could not be found.",
            },
            {
                status: 404,
            },
        );
    }

    if (existingApplication.status === body.status) {
        return Response.json(
            {
                message:
                    "The application already has the selected status.",
            },
            {
                status: 400,
            },
        );
    }

    /*
     * The application status and audit event are written
     * together as one nested relational operation.
     */
    const application =
        await prisma.application.update({
            where: {
                id,
            },
            data: {
                status: body.status,

                activities: {
                    create: {
                        type: "STATUS_CHANGE",
                        message: comment || null,
                        previousStatus:
                            existingApplication.status,
                        newStatus: body.status,
                        recruiterId: session.user.id,
                        recruiterName: session.user.name,
                        recruiterEmail: session.user.email,
                    },
                },
            },
            select: {
                id: true,
                referenceId: true,
                status: true,
                updatedAt: true,
            },
        });

    revalidatePath("/recruiter/dashboard");
    revalidatePath("/recruiter/applications");
    revalidatePath("/recruiter/candidates");

    revalidatePath(
        `/recruiter/applications/${id}`,
    );

    revalidatePath(
        `/recruiter/candidates/${existingApplication.candidateId}`,
    );

    return Response.json({
        message: `Status updated to ${getApplicationStatusLabel(
            application.status,
        )}.`,
        application,
    });
}