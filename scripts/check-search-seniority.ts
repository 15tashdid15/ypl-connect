import "dotenv/config";

import prisma from "@/lib/prisma";


async function main() {

    const profiles =
        await prisma.candidateSearchProfile.findMany({

            select: {

                seniority: true,

                totalExperienceYears: true,

                candidate: {

                    select: {

                        fullName: true,

                    },

                },

            },

        });


    console.log(
        JSON.stringify(
            profiles,
            null,
            2,
        ),
    );

}


main()
.finally(
    async () =>
        await prisma.$disconnect(),
);