import prisma from "@/lib/prisma";

import {
    getAIProvider,
} from "./factory";


export async function getActiveAIProvider() {


    const config =
        await prisma.aIConfiguration.findFirst();


    if (!config) {

        return getAIProvider(
            "LOCAL"
        );

    }


    return getAIProvider(
        config.provider
    );

}