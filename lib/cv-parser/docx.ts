import mammoth from "mammoth";

export async function extractDocxText(
    buffer: Buffer,
) {
    const result =
        await mammoth.extractRawText({
            buffer,
        });

    return {
        text: result.value,
    };
}