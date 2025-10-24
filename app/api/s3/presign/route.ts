// This is a SERVER route
// It creates a one-time presigned URL for direct upload to S3.

import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function slugifyFilename(name: string) {
    // keep extension, clean the base name
    const lastDot = name.lastIndexOf(".");
    const base = (lastDot === -1 ? name : name.slice(0, lastDot))
        .toLowerCase()
        .replace(/\s+/g, "-")           // spaces dashes
        .replace(/[^a-z0-9-_]/g, "");   // drop odd chars (keep - and _)
    const ext = lastDot === -1 ? "" : name.slice(lastDot).toLowerCase();
    return `${base || "file"}${ext || ""}`;
}

export async function POST(request: Request) {

    // 1 Read the fileName and contentType from the client
    const { fileName, contentType } = await request.json();

    // 2 Create an S3 client with server-side credentials (from .env)
    const s3 = new S3Client({
        region: process.env.AWS_REGION!,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
    });

    // 3 Make a unique key for the upload
    const imageName = slugifyFilename(fileName || "upload");
    const key = `images/${Date.now()}_${imageName}`;

    // 4 Prepare the "put object" command with your target bucket/key
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME!, // target bucket
        Key: key,                                // object key (path/filename)
        ContentType: contentType,                // file type
    });

    // 5 Create a presigned URL (valid for 60s). The client can PUT the file to this URL.
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

    // 6 Return the upload URL and the final public URL
    const publicUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
    return NextResponse.json({ uploadUrl, publicUrl });
}
