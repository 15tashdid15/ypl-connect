import "dotenv/config";

import prisma from "@/lib/prisma";

import {
    processCvParseJob,
} from "@/lib/cv-parser/worker";


async function main() {


    const jobs =
        await prisma.cvParseJob.findMany({

            where: {

                status: "SUCCEEDED",

            },

            select: {

                id: true,

                candidateDocument: {

                    select: {

                        candidate: {

                            select: {

                                fullName: true,

                            },

                        },

                    },

                },

            },

            orderBy: {

                createdAt: "asc",

            },

        });



    console.log(
        `Found ${jobs.length} successful CV jobs`,
    );



    for (
        const job of jobs
    ) {


        console.log(
            "\nProcessing:",
            job.candidateDocument?.candidate.fullName,
        );


        try {


            await processCvParseJob(
                job.id,
            );


            console.log(
                "Updated successfully",
            );


        } catch (error) {


            console.error(
                "Failed:",
                error instanceof Error
                    ? error.message
                    : error,
            );


        }


    }


}



main()
    .catch(console.error)
    .finally(
        async () =>
            await prisma.$disconnect(),
    );