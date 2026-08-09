import "dotenv/config";
import prisma from "@/lib/prisma";
import { processCvParseJob } from "@/lib/cv-parser/worker";

const CV_JOB_TIMEOUT_MINUTES = 30;
const MAX_CV_JOB_ATTEMPTS = 3;

async function recoverStaleCvParseJobs() {
    const timeoutDate =
        new Date(
            Date.now() -
            CV_JOB_TIMEOUT_MINUTES *
            60 *
            1000,
        );


    const staleJobs =
        await prisma.cvParseJob.findMany({
            where: {
                status: "PROCESSING",

                startedAt: {
                    lt: timeoutDate,
                },

                attemptCount: {
                    lt: MAX_CV_JOB_ATTEMPTS,
                },
            },

            select: {
                id: true,
            },
        });


    if (staleJobs.length === 0) {
        return;
    }


    await prisma.cvParseJob.updateMany({
        where: {
            id: {
                in: staleJobs.map(
                    (job) => job.id,
                ),
            },
        },

        data: {
            status: "QUEUED",
            startedAt: null,
        },
    });


    console.log(
        `Recovered ${staleJobs.length} stale CV parse job(s).`,
    );
}

async function claimNextCvParseJob() {
    return await prisma.$transaction(
        async (tx) => {
            const job =
                await tx.cvParseJob.findFirst({
                    where: {
                        status: "QUEUED",
                    },
                    orderBy: {
                        createdAt: "asc",
                    },
                });


            if (!job) {
                return null;
            }


            return await tx.cvParseJob.update({
                where: {
                    id: job.id,
                },
                data: {
                    status: "PROCESSING",
                    startedAt: new Date(),
                    attemptCount: {
                        increment: 1,
                    },
                },
            });
        },
    );
}


async function main() {

    await recoverStaleCvParseJobs();


    const job =
        await claimNextCvParseJob();


    if (!job) {
        console.log(
            "No queued CV parse jobs found.",
        );

        return;
    }


    console.log(
        "Processing job:",
        job.id,
    );


    const result =
        await processCvParseJob(
            job.id,
        );


    console.log(
        "Completed:",
        result,
    );
}


main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });