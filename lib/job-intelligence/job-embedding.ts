import {
    generateEmbedding,
} from "@/lib/ai/embedding-provider";



export async function generateJobEmbedding(
    searchableText: string,
) {


    const embedding =
        await generateEmbedding(
            searchableText,
        );


    return embedding;

}