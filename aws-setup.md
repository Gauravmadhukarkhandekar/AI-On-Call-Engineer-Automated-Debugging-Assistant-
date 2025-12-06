# AWS Setup Guide

This guide will help you set up the required AWS resources for the AI On-Call Engineer platform.

## Prerequisites

- AWS CLI installed and configured
- AWS account with appropriate permissions

## 1. Create S3 Bucket

```bash
aws s3 mb s3://ai-on-call-logs --region us-east-1
```

Or create via AWS Console:
1. Go to S3 service
2. Click "Create bucket"
3. Name: `ai-on-call-logs`
4. Region: Choose your preferred region
5. Uncheck "Block all public access" (or configure bucket policy as needed)
6. Create bucket

## 2. Create DynamoDB Table

```bash
aws dynamodb create-table \
  --table-name incidents \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

Or create via AWS Console:
1. Go to DynamoDB service
2. Click "Create table"
3. Table name: `incidents`
4. Partition key: `id` (String)
5. Settings: Use default settings or choose "On-demand" billing
6. Create table

## 3. Create IAM User for Application

1. Go to IAM service
2. Click "Users" → "Add users"
3. User name: `ai-on-call-engineer`
4. Select "Programmatic access"
5. Attach policies:
   - `AmazonS3FullAccess` (or create custom policy for specific bucket)
   - `AmazonDynamoDBFullAccess` (or create custom policy for specific table)
6. Save the Access Key ID and Secret Access Key

## 4. Lambda Deployment (Optional - for serverless deployment)

If deploying to Lambda:

1. Install Serverless Framework:
```bash
npm install -g serverless
```

2. Configure AWS credentials:
```bash
aws configure
```

3. Deploy:
```bash
cd lambda
npm install
npm run build
serverless deploy
```

## 5. Environment Variables

Set the following environment variables in your Lambda function or `.env` file:

- `AWS_REGION`: Your AWS region (e.g., `us-east-1`)
- `AWS_ACCESS_KEY_ID`: IAM user access key
- `AWS_SECRET_ACCESS_KEY`: IAM user secret key
- `S3_BUCKET_NAME`: Your S3 bucket name
- `DYNAMODB_TABLE_NAME`: Your DynamoDB table name

## 6. Testing

Test the setup:

```bash
# Test S3 access
aws s3 ls s3://ai-on-call-logs

# Test DynamoDB access
aws dynamodb describe-table --table-name incidents
```

## Security Best Practices

1. **Use IAM Roles** (for Lambda): Instead of access keys, use IAM roles attached to Lambda functions
2. **Least Privilege**: Grant only necessary permissions (S3 read/write to specific bucket, DynamoDB access to specific table)
3. **Encryption**: Enable S3 bucket encryption and DynamoDB encryption at rest
4. **VPC**: Consider deploying Lambda in VPC if accessing private resources

