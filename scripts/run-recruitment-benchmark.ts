import "dotenv/config";

import prisma from "@/lib/prisma";

import {
    getActiveAIProvider,
} from "@/lib/ai/router";

import {
    saveJobSearchProfile,
} from "@/lib/job-intelligence/save-job-profile";

import {
    findRecommendedCandidates,
} from "@/lib/job-matching/candidate-recommendation";

import {
    hrBenchmarks,
} from "./benchmarks/hr-recruitment-benchmark";



async function evaluateRanking({

    results,

    expectedCandidates,

}: {

    results: {
        name: string | null;
    }[];

    expectedCandidates: string[];

}) {


    const rankedNames =
        results.map(
            item =>
                item.name,
        );


    const top1 =
        rankedNames[0] === expectedCandidates[0];


    const top3 =
        rankedNames
            .slice(0, 3)
            .filter(
                name =>
                    name &&
                    expectedCandidates.includes(
                        name,
                    ),
            )
            .length;



    return {

        top1,

        top3MatchCount:
            top3,

        rankedNames,

    };

}



async function runBenchmark() {


    const provider =
        await getActiveAIProvider();



    for (
        const benchmark of hrBenchmarks
    ) {


        console.log(
            "\n==============================",
        );

        console.log(
            benchmark.id,
        );

        console.log(
            "==============================",
        );



        const profile =
            await provider.extractJobProfile(
                benchmark.jobDescription,
            );



        const job =
            await prisma.job.create({

                data: {

                    title:
                        profile.title ??
                        "Benchmark Job",


                    description:
                        benchmark.jobDescription,


                    companyName:
                        "Benchmark Company",


                    location:
                        "Dhaka",


                    experienceRequired:
                        profile.requiredExperienceYears,

                },

            });



        await saveJobSearchProfile({

            jobId:
                job.id,

            profile,

        });



        const results =
            await findRecommendedCandidates(
                job.id,
            );



        const evaluation =
            await evaluateRanking({

                results,

                expectedCandidates:
                    benchmark.expectedCandidates,

            });



        console.log(
            JSON.stringify(
                evaluation,
                null,
                2,
            ),
        );



        await prisma.job.delete({

            where: {

                id:
                    job.id,

            },

        });

    }

}



runBenchmark()

    .catch(console.error)

    .finally(

        async () =>
            await prisma.$disconnect(),

    );