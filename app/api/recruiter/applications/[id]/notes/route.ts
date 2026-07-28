import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { getRecruiterSession } from "@/lib/recruiter-session";

export const runtime = "nodejs";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

type NoteRequestBody = {
    message?: unknown;
};

export async function POST(
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

    let body: NoteRequestBody;

    try {
        body = (await request.json()) as NoteRequestBody;
    } catch {
        return Response.json(
            {
                message: "The note request is invalid.",
            },
            {
                status: 400,
            },
        );
    }

    const message =
        typeof body.message === "string"
            ? body.message.trim()
            : "";

    if (message.length < 2) {
        return Response.json(
            {
                message: "Enter an internal note.",
            },
            {
                status: 400,
            },
        );
    }

    if (message.length > 2000) {
        return Response.json(
            {
                message:
                    "The internal note cannot exceed 2,000 characters.",
            },
            {
                status: 400,
            },
        );
    }

    const application =
        await prisma.application.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
            },
        });

    if (!application) {
        return Response.json(
            {
                message: "The application could not be found.",
            },
            {
                status: 404,
            },
        );
    }

    const activity =
        await prisma.applicationActivity.create({
            data: {
                type: "NOTE",
                message,
                applicationId: application.id,
                recruiterId: session.user.id,
                recruiterName: session.user.name,
                recruiterEmail: session.user.email,
            },
            select: {
                id: true,
                type: true,
                message: true,
                recruiterName: true,
                createdAt: true,
            },
        });

    revalidatePath(
        `/recruiter/applications/${application.id}`,
    );

    return Response.json(
        {
            message: "Internal note added successfully.",
            activity,
        },
        {
            status: 201,
        },
    );
}
