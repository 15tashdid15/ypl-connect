export const MAX_CV_SIZE = 5 * 1024 * 1024;

const cvMimeTypes = {
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
} as const;

export type CvExtension = keyof typeof cvMimeTypes;

export function getCvExtension(
    filename: string,
): CvExtension | null {
    const normalizedFilename = filename.toLowerCase();

    const extension = Object.keys(cvMimeTypes).find((item) =>
        normalizedFilename.endsWith(item),
    );

    return (extension as CvExtension | undefined) ?? null;
}

export function resolveCvContentType(
    filename: string,
    submittedContentType: string,
) {
    const extension = getCvExtension(filename);

    if (!extension) {
        return null;
    }

    const expectedContentType = cvMimeTypes[extension];

    if (
        !submittedContentType ||
        submittedContentType === "application/octet-stream"
    ) {
        return expectedContentType;
    }

    return submittedContentType === expectedContentType
        ? expectedContentType
        : null;
}

export function createCvStorageKey(
    jobSlug: string,
    filename: string,
) {
    const extension = getCvExtension(filename);

    if (!extension) {
        throw new Error("Unsupported CV extension.");
    }

    const year = new Date().getUTCFullYear();

    return `cvs/${year}/${jobSlug}/${crypto.randomUUID()}${extension}`;
}

export function isValidCvStorageKey(
    storageKey: string,
    jobSlug: string,
) {
    const parts = storageKey.split("/");

    if (parts.length !== 4) {
        return false;
    }

    const [root, year, storedJobSlug, filename] = parts;

    return (
        root === "cvs" &&
        /^\d{4}$/.test(year) &&
        storedJobSlug === jobSlug &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(pdf|doc|docx)$/i.test(
            filename,
        )
    );
}