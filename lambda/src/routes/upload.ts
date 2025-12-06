import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { uploadToS3 } from '../services/s3';
import { createIncident, updateIncidentStatus } from '../services/dynamodb';
import { analyzeLogs } from '../services/aiAnalyzer';
import { sendSlackNotification } from '../services/slack';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('logFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const incidentId = uuidv4();
    const fileName = file.originalname;
    const timestamp = new Date().toISOString();

    // Create incident record
    await createIncident({
      id: incidentId,
      fileName,
      status: 'pending',
      createdAt: timestamp,
    });

    // Upload to S3
    const s3Key = `logs/${incidentId}/${fileName}`;
    await uploadToS3(s3Key, file.buffer, file.mimetype);

    // Update incident with S3 key
    await updateIncidentStatus(incidentId, {
      s3Key,
      status: 'analyzing',
    });

    // Start async analysis (don't wait for it)
    analyzeLogs(incidentId, s3Key, fileName).catch((error) => {
      console.error(`Analysis failed for incident ${incidentId}:`, error);
      updateIncidentStatus(incidentId, {
        status: 'failed',
        errorMessage: error.message,
      });
    });

    res.json({
      incidentId,
      message: 'Log file uploaded successfully. Analysis in progress.',
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Failed to upload file' });
  }
});

export default router;

