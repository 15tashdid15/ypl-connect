import "dotenv/config";
import prisma from "@/lib/prisma";
import { processCvParseJob } from "@/lib/cv-parser/worker";


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