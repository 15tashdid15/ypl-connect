import "dotenv/config";

import prisma from "@/lib/prisma";


async function main() {

    const results =
        await prisma.cvParseResult.findMany({

            select: {

                fullName: true,

                headline: true,

                seniority: true,

                totalExperienceYears: true,

            },

        });


    console.log(
        JSON.stringify(
            results,
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