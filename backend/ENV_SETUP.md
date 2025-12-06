# Backend Environment Variables Setup

## Create `.env` file

Create a file named `.env` in the `backend/` directory with the following content:

```env
PORT=3001
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
S3_BUCKET_NAME=ai-on-call-logs
DYNAMODB_TABLE_NAME=incidents
OPENAI_API_KEY=sk-your-openai-api-key-here
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
USE_ANTHROPIC=false
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

## Required Variables

### Minimum Required (to start the server):
- `OPENAI_API_KEY` - Your OpenAI API key (get from https://platform.openai.com/api-keys)
  OR
- `ANTHROPIC_API_KEY` - Your Anthropic API key (if using Claude instead)

### AWS Variables (for full functionality):
- `AWS_REGION` - AWS region (e.g., us-east-1)
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `S3_BUCKET_NAME` - Name of your S3 bucket
- `DYNAMODB_TABLE_NAME` - Name of your DynamoDB table

### Optional:
- `PORT` - Server port (default: 3001)
- `USE_ANTHROPIC` - Set to "true" to use Claude instead of GPT-4
- `SLACK_WEBHOOK_URL` - Slack webhook URL for notifications

## Quick Start (Minimal Config)

For testing, you only need:

```env
PORT=3001
OPENAI_API_KEY=sk-your-actual-key-here
```

**Note:** Without AWS credentials, file uploads won't work, but the server will start.

## How to Create the File

**PowerShell:**
```powershell
cd backend
New-Item -Path .env -ItemType File
# Then edit it with your editor or:
notepad .env
```

**Or manually:**
1. Navigate to `backend/` folder
2. Create a new file named `.env` (no extension)
3. Copy the template above and fill in your values

