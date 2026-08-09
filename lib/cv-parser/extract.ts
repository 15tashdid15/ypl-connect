import { extractPdfText } from "./pdf";
import { extractDocxText } from "./docx";


export async function extractCvText(
    buffer: Buffer,
    mimeType: string,
) {

    if (
        mimeType === "application/pdf"
    ) {
        return extractPdfText(buffer);
    }


    if (
        mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
        return extractDocxText(buffer);
    }


    throw new Error(
        "Unsupported CV file type",
    );
}