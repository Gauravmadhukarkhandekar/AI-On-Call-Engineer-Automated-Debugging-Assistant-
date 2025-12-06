# Quick Start Guide

Get the AI On-Call Engineer platform up and running in minutes!

## Prerequisites

- Node.js 18+ installed
- AWS account (for S3 and DynamoDB)
- OpenAI API key OR Anthropic API key
- Slack webhook URL (optional)

## Step 1: Clone and Install

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install backend dependencies
cd backend && npm install && cd ..
```

## Step 2: Set Up AWS Resources

### Create S3 Bucket
```bash
aws s3 mb s3://ai-on-call-logs --region us-east-1
```

### Create DynamoDB Table
```bash
aws dynamodb create-table \
  --table-name incidents \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

### Get AWS Credentials
1. Go to AWS IAM Console
2. Create a new user with programmatic access
3. Attach policies: `AmazonS3FullAccess` and `AmazonDynamoDBFullAccess`
4. Save the Access Key ID and Secret Access Key

## Step 3: Configure Environment Variables

### Backend Configuration

Create `backend/.env`:
```env
PORT=3001
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
S3_BUCKET_NAME=ai-on-call-logs
DYNAMODB_TABLE_NAME=incidents
OPENAI_API_KEY=sk-your-openai-key
# OR use Claude:
# ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
# USE_ANTHROPIC=true
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

### Frontend Configuration

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Step 4: Run the Application

### Option A: Run Both Services Together
```bash
npm run dev
```

### Option B: Run Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Step 5: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## Step 6: Test the Application

1. Open http://localhost:3000
2. Go to "Upload Logs" tab
3. Upload a log file (`.log`, `.txt`, or `.json`)
4. Check the "Dashboard" tab to see the analysis progress
5. Once complete, view the root cause and suggested fix

## Troubleshooting

### Backend won't start
- Check that all environment variables are set in `backend/.env`
- Verify AWS credentials are correct
- Ensure S3 bucket and DynamoDB table exist

### Frontend can't connect to backend
- Verify `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
- Check that backend is running on port 3001
- Check browser console for CORS errors

### Analysis fails
- Verify OpenAI/Anthropic API key is valid
- Check backend logs for error messages
- Ensure log file isn't too large (max ~50KB analyzed)

### Slack notifications not working
- Verify webhook URL is correct
- Check that webhook URL is active in Slack
- Notifications are optional - app works without them

## Next Steps

- Deploy to production (see `DEPLOYMENT.md`)
- Set up monitoring and alerts
- Configure custom AI prompts
- Add more integrations

## Need Help?

- Check `DEPLOYMENT.md` for production deployment
- See `aws-setup.md` for detailed AWS configuration
- Review the main `README.md` for architecture details

