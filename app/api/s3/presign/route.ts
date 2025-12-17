// SERVER ROUTE
// Creates a one-time presigned URL for direct upload to S3

import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function slugifyFilename(name: string) {
    const lastDot = name.lastIndexOf(".");
    const base = (lastDot === -1 ? name : name.slice(0, lastDot))
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-_]/g, "");

    const ext = lastDot === -1 ? "" : name.slice(lastDot).toLowerCase();
    return `${base || "file"}${ext || ""}`;
}

export async function POST(request: Request) {
    try {
        // 1️⃣ Read input
        const {
            fileName,
            contentType,
            folder = "images", // 👈 default stays images
        } = await request.json();

        // 2️⃣ Whitelist folders (security)
        const allowedFolders = ["images", "documents"];
        const safeFolder = allowedFolders.includes(folder)
            ? folder
            : "documents";

        // 3️⃣ Init S3
        const s3 = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
        });

        // 4️⃣ Build S3 key
        const safeName = slugifyFilename(fileName || "upload");
        const key = `${safeFolder}/${Date.now()}_${safeName}`;

        // 5️⃣ Presign PUT URL
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: key,
            ContentType: contentType,
        });

        const uploadUrl = await getSignedUrl(s3, command, {
            expiresIn: 60,
        });

        // 6️⃣ Public URL (MATCHES your image URLs)
        const publicUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;

        return NextResponse.json({
            uploadUrl,
            publicUrl,
            key,
        });
    } catch (error) {
        console.error("Presign error:", error);
        return NextResponse.json(
            { message: "Failed to generate presigned URL" },
            { status: 500 }
        );
    }
}
