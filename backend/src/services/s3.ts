import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'ai-on-call-logs';

export async function uploadToS3(key: string, body: Buffer, contentType: string): Promise<string> {
  const params: AWS.S3.PutObjectRequest = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
  };

  await s3.putObject(params).promise();
  return `s3://${BUCKET_NAME}/${key}`;
}

export async function getFromS3(key: string): Promise<string> {
  const params: AWS.S3.GetObjectRequest = {
    Bucket: BUCKET_NAME,
    Key: key,
  };

  const data = await s3.getObject(params).promise();
  return data.Body?.toString('utf-8') || '';
}

