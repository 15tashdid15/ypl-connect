import type {
    AIConfiguration,
} from "./config";


export const DEFAULT_AI_CONFIG:
AIConfiguration = {

    provider:
        "LOCAL",

    fallbackEnabled:
        true,

    fallbackProvider:
        "GEMINI",

};