import { S3 } from 'aws-sdk';
import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload';
import SendData = ManagedUpload.SendData;
import { DeleteObjectOutput } from 'aws-sdk/clients/s3';
import { env } from "../utils/env";
import { logger } from "~utils/logger";

const spaceName = 'sneakerbase';
const s3 = new S3({
  endpoint: 'nyc3.digitaloceanspaces.com',
  accessKeyId: env.SPACES_ACCESS_KEY,
  secretAccessKey: env.SPACES_SECRET_KEY,
});

export async function uploadFile(
  buffer: Buffer,
  fileName: string,
  bucketName: string,
  contentType?: string,
): Promise<SendData> {
  return await uploadS3(
    buffer,
    spaceName + '/' + bucketName,
    fileName,
    contentType,
  );
}

export async function removeFile(
  fileName: string,
  bucketName: string,
): Promise<DeleteObjectOutput> {
  return await removeS3(spaceName + '/' + bucketName, fileName);
}

function uploadS3(
  file: Buffer,
  bucket: string,
  name: string,
  contentType?: string,
): Promise<SendData> {
  const params = contentType
    ? {
      ACL: 'public-read',
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ContentType: contentType,
    }
    : {
      ACL: 'public-read',
      Bucket: bucket,
      Key: String(name),
      Body: file,
    };

  return new Promise((resolve, reject) => {
    s3.upload({ ...params }, (err, data: SendData) => {
      if (err) {
        logger.error(err);
        reject(err.message);
      }
      resolve(data);
    });
  });
}

function removeS3(bucket: string, name: string): Promise<DeleteObjectOutput> {
  const params = {
    Bucket: bucket,
    Key: String(name),
  };

  return new Promise((resolve, reject) => {
    s3.deleteObject(params, (err, data) => {
      if (err) {
        logger.error(err);
        reject(err.message);
      }
      resolve(data);
    });
  });
}
