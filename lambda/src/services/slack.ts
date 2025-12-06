import axios from 'axios';

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

export interface SlackNotificationData {
  incidentId: string;
  fileName: string;
  summary: string;
  rootCause: string;
  suggestedFix: string;
}

export async function sendSlackNotification(data: SlackNotificationData): Promise<void> {
  if (!SLACK_WEBHOOK_URL) {
    console.warn('Slack webhook URL not configured. Skipping notification.');
    return;
  }

  try {
    const message = {
      text: `🔍 *New Incident Analyzed: ${data.fileName}*`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `🔍 Incident Analyzed: ${data.fileName}`,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Incident ID:*\n\`${data.incidentId}\``,
            },
            {
              type: 'mrkdwn',
              text: `*File:*\n${data.fileName}`,
            },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Summary:*\n${data.summary}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Root Cause:*\n${data.rootCause}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Suggested Fix:*\n${data.suggestedFix}`,
          },
        },
        {
          type: 'divider',
        },
      ],
    };

    await axios.post(SLACK_WEBHOOK_URL, message);
  } catch (error) {
    console.error('Failed to send Slack notification:', error);
    // Don't throw - notification failure shouldn't break the flow
  }
}

