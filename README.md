# AI On-Call Engineer (Automated Debugging Assistant)

A SaaS platform that helps developers and DevOps teams automatically debug production issues. Upload logs, and an AI/LLM analyzes them to identify root causes and suggest fixes.

## Features

- 📊 **Dashboard**: Track incidents and their analysis history
- 📤 **Log Upload**: Upload production logs for AI analysis
- 🤖 **AI Analysis**: Automatic root cause identification using GPT-4/Claude
- 🔔 **Slack Notifications**: Get notified when incidents are analyzed
- ☁️ **Cloud Storage**: Secure log storage in S3 and metadata in DynamoDB

## Tech Stack

- **Frontend**: Next.js + React + TailwindCSS + shadcn/UI
- **Backend**: Node.js + Express (AWS Lambda via API Gateway)
- **Storage**: S3 (logs) + DynamoDB (incident metadata)
- **Integrations**: Slack Webhook, OpenAI GPT-4 / Claude LLM

## Getting Started

### Quick Start

For a step-by-step guide to get up and running quickly, see **[QUICKSTART.md](./QUICKSTART.md)**

### Prerequisites

- Node.js 18+ 
- AWS Account (for S3, DynamoDB, Lambda)
- OpenAI API key or Anthropic API key
- Slack Webhook URL (optional)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

3. Set up AWS resources (see [aws-setup.md](./aws-setup.md) for details)

4. Configure environment variables (see [QUICKSTART.md](./QUICKSTART.md) for details)

5. Run development servers:
```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Project Structure

```
├── frontend/              # Next.js application
│   ├── app/              # Next.js app directory
│   ├── components/       # React components (shadcn/UI)
│   └── lib/              # Utilities and API client
├── backend/               # Express API server
│   ├── src/
│   │   ├── routes/       # API routes
│   │   └── services/     # Business logic (S3, DynamoDB, AI, Slack)
│   └── dist/             # Compiled TypeScript
├── lambda/                # AWS Lambda handler
│   ├── src/              # Lambda-specific code
│   └── serverless.yml    # Serverless Framework config
└── README.md
```

## Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Get started in minutes
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide
- **[aws-setup.md](./aws-setup.md)** - AWS resource setup instructions

## Deployment

For detailed deployment instructions, see **[DEPLOYMENT.md](./DEPLOYMENT.md)**

### Quick Deploy Options

**AWS Lambda + API Gateway:**
```bash
cd lambda
npm install
serverless deploy
```

**Frontend (Vercel/Netlify):**
```bash
cd frontend
npm run build
# Deploy to your preferred platform
```

## License

MIT

