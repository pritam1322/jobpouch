import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import uniqid from "uniqid";

export async function POST(req: Request): Promise<Response> {
    try {
        const formData = await req.formData();

        if (!formData.has("file")) {
            return new Response(JSON.stringify({ error: "No file uploaded" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const file = formData.get("file") as File; // Type assertion
        if (!file) {
            return new Response(JSON.stringify({ error: "Invalid file format" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const s3Client = new S3Client({
            region: "us-east-1",
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY || "",
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
            },
        });

        const randomId = uniqid();
        const ext = file.name.split(".").pop();
        const newFileName = `${randomId}.${ext}`;
        const bucketName = process.env.BUCKET_NAME || "";


        const stream = file.stream();
        const reader = stream.getReader();
        const chunks: Uint8Array[] = [];
        

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
        }

        await s3Client.send(
            new PutObjectCommand({
                Bucket: bucketName,
                Key: newFileName,
                Body: Buffer.concat(chunks),
                ContentType: file.type,
            })
        );

        const link = `https://${bucketName}.s3.amazonaws.com/${newFileName}`;

        return new Response(JSON.stringify({ url: link }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Upload error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
