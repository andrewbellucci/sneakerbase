import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { env } from "./env";

const spaceName = "sneakerbase";
const s3 = new S3Client({
  endpoint: "https://990780148d62a437b13e976156284680.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
  },
  region: "auto",
});

export async function removeFile(fileName: string, bucketName: string) {
  return await removeS3(spaceName, bucketName + "/" + fileName);
}

export function uploadS3(
  file: Buffer,
  bucket: string,
  name: string,
  contentType?: string
) {
  const params = contentType
    ? {
        ACL: "public-read",
        Bucket: bucket,
        Key: String(name),
        Body: file,
        ContentType: contentType,
      }
    : {
        ACL: "public-read",
        Bucket: bucket,
        Key: String(name),
        Body: file,
      };

  return s3.send(new PutObjectCommand(params));
}

function removeS3(bucket: string, name: string) {
  return s3.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: String(name),
    })
  );
}
