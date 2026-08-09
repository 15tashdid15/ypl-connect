import "dotenv/config";

import prisma from "@/lib/prisma";

import {
    findRecommendedCandidates,
} from "@/lib/job-matching/candidate-recommendation";


async function main() {


    const job =
        await prisma.job.findFirst({

            orderBy: {
                createdAt: "desc",
            },

        });



    if (!job) {

        throw new Error(
            "No job found",
        );

    }



    const results =
        await findRecommendedCandidates(
            job.id,
        );


    console.log(
        JSON.stringify(
            results,
            null,
            2,
        ),
    );

}


main();