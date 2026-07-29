import "dotenv/config";
import prisma from "@/lib/prisma";
import { processCvParseJob } from "@/lib/cv-parser/worker";


async function main() {

    const job =
        await prisma.cvParseJob.findFirst({
            where: {
                status: "QUEUED",
            },
            orderBy: {
                createdAt: "asc",
            },
        });


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