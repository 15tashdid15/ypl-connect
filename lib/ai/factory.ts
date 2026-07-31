import type {
    CVAIProvider,
} from "./provider";


import {
    LocalAIProvider,
} from "./local-provider";


import {
    APIAIProvider,
} from "./api-provider";



export function getAIProvider(
    provider: "LOCAL" | "OPENAI" | "GEMINI",
): CVAIProvider {


    switch (provider) {


        case "LOCAL":

            return new LocalAIProvider();



        case "OPENAI":

        case "GEMINI":

            return new APIAIProvider();



        default:

            return new LocalAIProvider();

    }

}