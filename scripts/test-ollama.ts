import { askOllama } from "@/lib/ai/ollama-client";


async function main() {

    const result =
        await askOllama(
            `
            Extract skills from:

            Senior Software Engineer with
            React, Node.js and PostgreSQL experience.

            Return JSON only.
            `,
        );


    console.log(result);

}


main();