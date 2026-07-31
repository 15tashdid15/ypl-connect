const OLLAMA_URL =
    process.env.OLLAMA_URL ??
    "http://localhost:11434";


const OLLAMA_MODEL =
    process.env.OLLAMA_MODEL ??
    "qwen2.5:7b";


export async function askOllama(
    prompt: string,
) {

    const response =
        await fetch(
            `${OLLAMA_URL}/api/generate`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                body: JSON.stringify({

                    model: OLLAMA_MODEL,

                    prompt,

                    stream: false,

                    format: "json",

                }),
            },
        );


    if (!response.ok) {

        throw new Error(
            `Ollama request failed: ${response.status}`,
        );

    }


    const data =
        await response.json();


    return data.response;

}