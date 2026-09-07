import "dotenv/config";

import { readFile } from "node:fs/promises";
import path from "node:path";

import { extractCvText } from "@/lib/cv-parser/extract";
import { LocalAIProvider } from "@/lib/ai/local-provider";

const DOCX_MIME =
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

async function main() {
    const suppliedPath = process.argv[2];

    if (!suppliedPath) {
        throw new Error(
            "Provide the DOCX path. Example: .\\test-data\\Test_Candidate_02.docx",
        );
    }

    const filePath = path.resolve(suppliedPath);
    const buffer = await readFile(filePath);

    console.log("File:", path.basename(filePath));
    console.log("File size:", buffer.length, "bytes");

    const extracted = await extractCvText(
        buffer,
        DOCX_MIME,
    );

    console.log("DOCX extraction: SUCCEEDED");
    console.log("Extraction method: DOCX_MAMMOTH");
    console.log("Character count:", extracted.text.length);
    console.log("\nExtracted-text preview:");
    console.log(extracted.text.slice(0, 500));

    const provider = new LocalAIProvider();

    const profile =
        await provider.extractCandidateProfile(
            extracted.text,
        );

    console.log("\nAI profile validation: SUCCEEDED");
    console.log("Structured candidate profile:");
    console.log(
        JSON.stringify(profile, null, 2),
    );
}

main().catch((error) => {
    console.error("\nLOCAL DOCX TEST: FAILED");
    console.error(
        error instanceof Error
            ? error.message
            : error,
    );

    process.exitCode = 1;
});