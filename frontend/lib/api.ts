import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export interface UploadResponse {
  incidentId: string;
  message: string;
}

export const uploadLog = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('logFile', file);

  const response = await api.post<UploadResponse>('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const getIncidents = async (): Promise<Incident[]> => {
  const response = await api.get<Incident[]>('/api/incidents');
  return response.data;
};

export const getIncident = async (id: string): Promise<Incident> => {
  const response = await api.get<Incident>(`/api/incidents/${id}`);
  return response.data;
};

