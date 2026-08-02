import "dotenv/config";

import prisma from "@/lib/prisma";


async function main() {

    const candidates =
        await prisma.candidateSearchProfile.findMany({

            select: {

                candidate: {

                    select: {

                        fullName: true,

                    },

                },

                seniority: true,

                totalExperienceYears: true,

            },

        });


    console.log(
        JSON.stringify(
            candidates,
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