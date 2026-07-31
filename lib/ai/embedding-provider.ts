const OLLAMA_EMBEDDING_URL =
    "http://localhost:11434/api/embeddings";


const EMBEDDING_MODEL =
    "nomic-embed-text";



export async function generateEmbedding(
    text: string,
): Promise<number[]> {


    const response =
        await fetch(
            OLLAMA_EMBEDDING_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                body: JSON.stringify({
                    model:
                        EMBEDDING_MODEL,

                    prompt:
                        text,
                }),
            },
        );


    if (!response.ok) {

        throw new Error(
            `Embedding generation failed: ${response.status}`,
        );

    }


    const data =
        await response.json();


    return data.embedding;

}