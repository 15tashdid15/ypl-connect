import prisma from "@/lib/prisma";


export async function searchCandidates(
    query: string,
) {

    const normalizedQuery =
        query
            .trim()
            .toLowerCase();


    if (!normalizedQuery) {
        return [];
    }


    const candidates =
        await prisma.candidateSearchProfile.findMany({

            where: {

                searchableText: {

                    contains:
                        normalizedQuery,

                    mode:
                        "insensitive",

                },

            },


            include: {

                candidate: true,

            },


        });


    return candidates;

}