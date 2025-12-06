# Deployment Guide

## Local Development

### Prerequisites
- Node.js 18+
- AWS credentials configured
- S3 bucket and DynamoDB table created (see `aws-setup.md`)

### Setup

1. **Install dependencies:**
```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

2. **Configure environment variables:**

   **Backend** (`backend/.env`):
   ```env
   PORT=3001
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_key
   AWS_SECRET_ACCESS_KEY=your_secret
   S3_BUCKET_NAME=ai-on-call-logs
   DYNAMODB_TABLE_NAME=incidents
   OPENAI_API_KEY=sk-...
   ANTHROPIC_API_KEY=sk-ant-...
   USE_ANTHROPIC=false
   SLACK_WEBHOOK_URL=https://hooks.slack.com/...
   ```

   **Frontend** (`frontend/.env.local`):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

3. **Run development servers:**
```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Production Deployment

### Option 1: AWS Lambda + API Gateway

1. **Build Lambda function:**
```bash
cd lambda
npm install
npm run build
```

2. **Deploy with Serverless Framework:**
```bash
serverless deploy
```

3. **Update frontend API URL:**
   Set `NEXT_PUBLIC_API_URL` to your API Gateway endpoint

### Option 2: Traditional Server Deployment

1. **Build backend:**
```bash
cd backend
npm install
npm run build
```

2. **Deploy to EC2, ECS, or your preferred hosting:**
   - Ensure environment variables are set
   - Run: `npm start`

3. **Deploy frontend to Vercel/Netlify:**
```bash
cd frontend
npm install
npm run build
```

   Configure environment variable:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL

## Environment Variables Reference

### Backend
- `PORT`: Server port (default: 3001)
- `AWS_REGION`: AWS region
- `AWS_ACCESS_KEY_ID`: AWS access key
- `AWS_SECRET_ACCESS_KEY`: AWS secret key
- `S3_BUCKET_NAME`: S3 bucket for logs
- `DYNAMODB_TABLE_NAME`: DynamoDB table name
- `OPENAI_API_KEY`: OpenAI API key
- `ANTHROPIC_API_KEY`: Anthropic API key (optional)
- `USE_ANTHROPIC`: Use Claude instead of GPT-4 (true/false)
- `SLACK_WEBHOOK_URL`: Slack webhook URL (optional)

### Frontend
- `NEXT_PUBLIC_API_URL`: Backend API URL

## Monitoring

- Check CloudWatch logs for Lambda functions
- Monitor DynamoDB metrics
- Track S3 bucket usage
- Set up alerts for failed analyses

