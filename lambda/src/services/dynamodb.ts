import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'incidents';

export interface Incident {
  id: string;
  fileName: string;
  status: 'pending' | 'analyzing' | 'completed' | 'failed';
  createdAt: string;
  analyzedAt?: string;
  rootCause?: string;
  suggestedFix?: string;
  summary?: string;
  s3Key?: string;
  errorMessage?: string;
}

export async function createIncident(incident: Incident): Promise<void> {
  const params = {
    TableName: TABLE_NAME,
    Item: incident,
  };

  await dynamodb.put(params).promise();
}

export async function getIncident(id: string): Promise<Incident | null> {
  const params = {
    TableName: TABLE_NAME,
    Key: { id },
  };

  const result = await dynamodb.get(params).promise();
  return (result.Item as Incident) || null;
}

export async function getAllIncidents(): Promise<Incident[]> {
  const params = {
    TableName: TABLE_NAME,
  };

  const result = await dynamodb.scan(params).promise();
  const incidents = (result.Items as Incident[]) || [];
  
  // Sort by createdAt descending
  return incidents.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function updateIncidentStatus(
  id: string,
  updates: Partial<Incident>
): Promise<void> {
  const updateExpression: string[] = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, any> = {};

  Object.keys(updates).forEach((key, index) => {
    const attrName = `#attr${index}`;
    const attrValue = `:val${index}`;
    updateExpression.push(`${attrName} = ${attrValue}`);
    expressionAttributeNames[attrName] = key;
    expressionAttributeValues[attrValue] = updates[key as keyof Incident];
  });

  const params = {
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: `SET ${updateExpression.join(', ')}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
  };

  await dynamodb.update(params).promise();
}

