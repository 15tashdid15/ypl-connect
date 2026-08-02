import "dotenv/config";

import prisma from "@/lib/prisma";


async function main() {

    const jobs =
        await prisma.cvParseJob.findMany({

            select: {

                id: true,

                status: true,

                createdAt: true,

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

                createdAt: "desc",

            },

        });


    console.log(
        JSON.stringify(
            jobs,
            null,
            2,
        ),
    );

}


main()
    .finally(
        async () => {
            await prisma.$disconnect();
        },
    );