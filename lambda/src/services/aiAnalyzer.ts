import { getFromS3 } from './s3';
import { updateIncidentStatus } from './dynamodb';
import { sendSlackNotification } from './slack';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const USE_ANTHROPIC = process.env.USE_ANTHROPIC === 'true';

export async function analyzeLogs(
  incidentId: string,
  s3Key: string,
  fileName: string
): Promise<void> {
  try {
    // Download log file from S3
    const logContent = await getFromS3(s3Key);
    
    // Truncate if too long (keep last 50KB for context)
    const maxLength = 50000;
    const truncatedLogs = logContent.length > maxLength 
      ? logContent.slice(-maxLength) 
      : logContent;

    // Analyze with AI
    const analysis = USE_ANTHROPIC && process.env.ANTHROPIC_API_KEY
      ? await analyzeWithClaude(truncatedLogs)
      : await analyzeWithOpenAI(truncatedLogs);

    // Update incident with analysis results
    await updateIncidentStatus(incidentId, {
      status: 'completed',
      analyzedAt: new Date().toISOString(),
      summary: analysis.summary,
      rootCause: analysis.rootCause,
      suggestedFix: analysis.suggestedFix,
    });

    // Send Slack notification
    await sendSlackNotification({
      incidentId,
      fileName,
      summary: analysis.summary,
      rootCause: analysis.rootCause,
      suggestedFix: analysis.suggestedFix,
    });
  } catch (error: any) {
    console.error('Analysis error:', error);
    await updateIncidentStatus(incidentId, {
      status: 'failed',
      errorMessage: error.message || 'Analysis failed',
    });
    throw error;
  }
}

async function analyzeWithOpenAI(logs: string): Promise<{
  summary: string;
  rootCause: string;
  suggestedFix: string;
}> {
  const prompt = `You are an expert DevOps engineer analyzing production logs. Analyze the following log file and provide:

1. A brief summary of what happened
2. The root cause of the issue
3. A suggested fix

Log content:
${logs}

Provide your response in the following JSON format:
{
  "summary": "Brief summary of the issue",
  "rootCause": "Detailed root cause analysis",
  "suggestedFix": "Step-by-step fix recommendation"
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are an expert DevOps engineer specializing in debugging production issues. Provide clear, actionable analysis.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.3,
    max_tokens: 1500,
  });

  const content = response.choices[0]?.message?.content || '{}';
  const analysis = JSON.parse(content);

  return {
    summary: analysis.summary || 'Unable to generate summary',
    rootCause: analysis.rootCause || 'Unable to identify root cause',
    suggestedFix: analysis.suggestedFix || 'Unable to suggest fix',
  };
}

async function analyzeWithClaude(logs: string): Promise<{
  summary: string;
  rootCause: string;
  suggestedFix: string;
}> {
  const prompt = `You are an expert DevOps engineer analyzing production logs. Analyze the following log file and provide:

1. A brief summary of what happened
2. The root cause of the issue
3. A suggested fix

Log content:
${logs}

Provide your response in the following JSON format:
{
  "summary": "Brief summary of the issue",
  "rootCause": "Detailed root cause analysis",
  "suggestedFix": "Step-by-step fix recommendation"
}`;

  const message = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 1500,
    temperature: 0.3,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  const analysis = JSON.parse(content.text);

  return {
    summary: analysis.summary || 'Unable to generate summary',
    rootCause: analysis.rootCause || 'Unable to identify root cause',
    suggestedFix: analysis.suggestedFix || 'Unable to suggest fix',
  };
}

