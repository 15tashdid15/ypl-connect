import {
    DeleteObjectCommand,
    GetObjectCommand,
    HeadObjectCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const CV_UPLOAD_URL_TTL_SECONDS = 300;
export const CV_DOWNLOAD_URL_TTL_SECONDS = 60;

let r2Client: S3Client | undefined;

function getRequiredEnvironmentVariable(name: string) {
    const value = process.env[name]?.trim();

    if (!value) {
        throw new Error(`${name} is not configured.`);
    }

    return value;
}

function getR2Client() {
    if (!r2Client) {
        r2Client = new S3Client({
            region: "auto",
            endpoint: getRequiredEnvironmentVariable("R2_ENDPOINT"),
            credentials: {
                accessKeyId:
                    getRequiredEnvironmentVariable("R2_ACCESS_KEY_ID"),
                secretAccessKey:
                    getRequiredEnvironmentVariable(
                        "R2_SECRET_ACCESS_KEY",
                    ),
            },
        });
    }

    return r2Client;
}

function getR2BucketName() {
    return getRequiredEnvironmentVariable("R2_BUCKET_NAME");
}

export async function createCvUploadUrl({
    storageKey,
    contentType,
}: {
    storageKey: string;
    contentType: string;
}) {
    return getSignedUrl(
        getR2Client(),
        new PutObjectCommand({
            Bucket: getR2BucketName(),
            Key: storageKey,
            ContentType: contentType,
        }),
        {
            expiresIn: CV_UPLOAD_URL_TTL_SECONDS,
        },
    );
}

export async function getCvObjectMetadata(
    storageKey: string,
) {
    return getR2Client().send(
        new HeadObjectCommand({
            Bucket: getR2BucketName(),
            Key: storageKey,
        }),
    );
}
export async function getCvObjectBuffer(
    storageKey: string,
) {
    const response =
        await getR2Client().send(
            new GetObjectCommand({
                Bucket: getR2BucketName(),
                Key: storageKey,
            }),
        );


    if (!response.Body) {
        throw new Error(
            "CV object body is empty.",
        );
    }


    const byteArray =
        await response.Body.transformToByteArray();


    return Buffer.from(byteArray);
}
export async function deleteCvObject(
    storageKey: string,
) {
    await getR2Client().send(
        new DeleteObjectCommand({
            Bucket: getR2BucketName(),
            Key: storageKey,
        }),
    );
}
function createSafeDownloadFilename(
    originalFilename: string,
) {
    const cleanedFilename = originalFilename
        .replace(/[\r\n"\\/]/g, "_")
        .trim();

    return cleanedFilename || "candidate-cv";
}

export async function createCvDownloadUrl({
    storageKey,
    originalFilename,
    contentType,
}: {
    storageKey: string;
    originalFilename: string;
    contentType: string;
}) {
    const safeFilename =
        createSafeDownloadFilename(originalFilename);

    return getSignedUrl(
        getR2Client(),
        new GetObjectCommand({
            Bucket: getR2BucketName(),
            Key: storageKey,
            ResponseContentType: contentType,
            ResponseContentDisposition:
                `attachment; filename="${safeFilename}"`,
        }),
        {
            expiresIn: CV_DOWNLOAD_URL_TTL_SECONDS,
        },
    );
}