import {
    generateEmbedding,
} from "@/lib/ai/embedding-provider";


async function main() {


    const vector =
        await generateEmbedding(
            "Senior HR Executive with payroll experience",
        );


    console.log(
        "Embedding size:",
        vector.length,
    );


    console.log(
        vector.slice(0, 5),
    );

}


main();