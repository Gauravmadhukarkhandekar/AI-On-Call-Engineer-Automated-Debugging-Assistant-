# How to Run Frontend and Backend

## Prerequisites

Make sure you have Node.js 18+ installed. Check with:
```bash
node --version
```

## Step 1: Install Dependencies

### Install Root Dependencies
```bash
npm install
```

### Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

### Install Backend Dependencies
```bash
cd backend
npm install
cd ..
```

## Step 2: Set Up Environment Variables

### Backend Environment Variables

Create a file `backend/.env` with the following:

```env
PORT=3001
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
S3_BUCKET_NAME=ai-on-call-logs
DYNAMODB_TABLE_NAME=incidents
OPENAI_API_KEY=sk-your-openai-api-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
USE_ANTHROPIC=false
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

**Note:** 
- You need AWS credentials (create S3 bucket and DynamoDB table first - see `aws-setup.md`)
- You need at least one AI API key (OpenAI or Anthropic)
- Slack webhook is optional

### Frontend Environment Variables

Create a file `frontend/.env.local` with:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Step 3: Run the Application

### Option A: Run Both Together (Recommended)

From the **root directory**, run:

```bash
npm run dev
```

This will start:
- **Frontend** on http://localhost:3000
- **Backend** on http://localhost:3001

### Option B: Run Separately

#### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

The backend will start on **http://localhost:3001**

#### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

The frontend will start on **http://localhost:3000**

## What Each Service Does

### Frontend (Port 3000)
- Next.js React application
- User interface for uploading logs
- Dashboard to view incident analysis
- Connects to backend API at port 3001

### Backend (Port 3001)
- Express.js API server
- Handles file uploads
- Stores files in S3
- Analyzes logs with AI
- Stores metadata in DynamoDB
- Sends Slack notifications

## Access Points

Once running:
- **Frontend UI**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **API Endpoints**:
  - `POST /api/upload` - Upload log file
  - `GET /api/incidents` - Get all incidents
  - `GET /api/incidents/:id` - Get specific incident

## Troubleshooting

### Backend won't start
- ✅ Check `backend/.env` file exists and has all required variables
- ✅ Verify AWS credentials are correct
- ✅ Ensure S3 bucket and DynamoDB table exist
- ✅ Check port 3001 is not already in use

### Frontend won't start
- ✅ Check `frontend/.env.local` file exists
- ✅ Verify `NEXT_PUBLIC_API_URL` points to backend (http://localhost:3001)
- ✅ Check port 3000 is not already in use
- ✅ Make sure backend is running first

### Frontend can't connect to backend
- ✅ Verify backend is running on port 3001
- ✅ Check browser console for CORS errors
- ✅ Verify `NEXT_PUBLIC_API_URL` in `frontend/.env.local` matches backend URL
- ✅ Check backend logs for errors

### "Module not found" errors
- ✅ Run `npm install` in the root, frontend, and backend directories
- ✅ Delete `node_modules` and reinstall if needed

## Development Workflow

1. **Start backend first** (or use `npm run dev` to start both)
2. **Open frontend** in browser at http://localhost:3000
3. **Upload a log file** to test the system
4. **Check dashboard** to see analysis progress
5. **View logs** in terminal to debug issues

## Production Build

### Build Frontend:
```bash
cd frontend
npm run build
npm start  # Runs production server
```

### Build Backend:
```bash
cd backend
npm run build
npm start  # Runs production server
```

