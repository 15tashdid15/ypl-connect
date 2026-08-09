import prisma from "@/lib/prisma";


import {
    buildJobSearchProfile,
} from "./job-profile";


import {
    generateJobEmbedding,
} from "./job-embedding";



import type {
    AIExtractedJobProfile,
} from "@/lib/ai/types";



export async function saveJobSearchProfile({

    jobId,

    profile,

}: {

    jobId: string;

    profile: AIExtractedJobProfile;

}) {


    const searchProfile =
        buildJobSearchProfile(
            profile,
        );



    const embedding =
        await generateJobEmbedding(
            searchProfile.searchableText,
        );



    return prisma.jobSearchProfile.upsert({

        where: {
            jobId,
        },


        update: {

            ...searchProfile,

            embedding,

        },


        create: {

            jobId,

            ...searchProfile,

            embedding,

        },

    });

}