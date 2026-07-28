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

    const existingApplication =
        await prisma.application.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
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

    const application = await prisma.application.update({
        where: {
            id,
        },
        data: {
            status: body.status,
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
    revalidatePath(`/recruiter/applications/${id}`);

    return Response.json({
        message: `Status updated to ${getApplicationStatusLabel(
            application.status,
        )}.`,
        application,
    });
}