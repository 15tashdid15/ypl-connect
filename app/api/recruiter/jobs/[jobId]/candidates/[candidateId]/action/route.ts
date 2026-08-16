import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { getRecruiterSession } from "@/lib/recruiter-session";


export const runtime = "nodejs";


type RouteContext = {
    params: Promise<{
        jobId: string;
        candidateId: string;
    }>;
};


type ActionRequestBody = {
    action?: unknown;
    note?: unknown;
};



export async function POST(
    request: Request,
    context: RouteContext,
) {


    const session =
        await getRecruiterSession(request);



    if (!session) {

        return Response.json(
            {
                message:
                    "Authentication is required.",
            },
            {
                status: 401,
            },
        );

    }



    const {
        jobId,
        candidateId,
    } =
        await context.params;



    let body: ActionRequestBody;


    try {

        body =
            (await request.json()) as ActionRequestBody;


    } catch {


        return Response.json(
            {
                message:
                    "Invalid request body.",
            },
            {
                status: 400,
            },
        );

    }



    if (
        typeof body.action !== "string" ||
        body.action.trim() === ""
    ) {


        return Response.json(
            {
                message:
                    "Action is required.",
            },
            {
                status: 400,
            },
        );

    }



    const action =
        body.action
            .trim()
            .toUpperCase();



    if (
        action !== "SHORTLIST" &&
        action !== "REJECT"
    ) {


        return Response.json(
            {
                message:
                    "Invalid action.",
            },
            {
                status: 400,
            },
        );

    }



    const note =
        typeof body.note === "string"
            ? body.note.trim()
            : null;



    if (
        note &&
        note.length > 2000
    ) {


        return Response.json(
            {
                message:
                    "Note cannot exceed 2000 characters.",
            },
            {
                status: 400,
            },
        );

    }



    const recruiterId =
        session.user.id;



    const job =
        await prisma.job.findUnique({

            where: {
                id: jobId,
            },

            select: {

                title: true,

            },

        });



    if (!job) {

        return Response.json(
            {
                message:
                    "Job not found.",
            },
            {
                status: 404,
            },
        );

    }



    const existingAction =
        await prisma.recruiterCandidateAction.findUnique({

            where: {

                jobId_candidateId_recruiterId: {

                    jobId,

                    candidateId,

                    recruiterId,

                },

            },

        });



    const savedAction =
        existingAction

            ? await prisma.recruiterCandidateAction.update({

                where: {

                    id:
                        existingAction.id,

                },

                data: {

                    action,

                    note,

                },

            })


            : await prisma.recruiterCandidateAction.create({

                data: {

                    jobId,

                    candidateId,

                    recruiterId,

                    action,

                    note,

                },

            });



    const applicationStatus =
        action === "SHORTLIST"
            ? "SHORTLISTED"
            : "REJECTED";


    console.log("DEBUG APPLICATION MATCH");

    console.log({
        candidateId,
        jobId,
        jobTitleFromJobTable: job.title,
    });
    const existingApplications =
        await prisma.application.findMany({

            where: {
                candidateId,
            },

            select: {
                id: true,
                jobTitle: true,
                jobSlug: true,
                status: true,
            },

        });


    console.log(
        "CANDIDATE APPLICATIONS:",
        existingApplications,
    );

    if (applicationStatus && job) {

        const updatedApplications =
            await prisma.application.updateMany({

                where: {

                    candidateId,

                    jobTitle: job.title,

                },

                data: {

                    status: applicationStatus,

                },

            });


        console.log(
            "APPLICATION UPDATE RESULT",
            updatedApplications.count,
        );

    }


    revalidatePath(
        `/recruiter/jobs/${jobId}/recommendations`,
    );



    return Response.json({

        message:
            "Candidate action saved successfully.",

        action:
            savedAction,

    });

}