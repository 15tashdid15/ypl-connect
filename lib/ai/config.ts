export type AIProviderType =
    | "LOCAL"
    | "GEMINI"
    | "OPENAI";


export type AIConfiguration = {

    provider: AIProviderType;

    fallbackEnabled: boolean;

    fallbackProvider?: AIProviderType;

};