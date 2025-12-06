import express from 'express';
import { getIncident, getAllIncidents } from '../services/dynamodb';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const incidents = await getAllIncidents();
    res.json(incidents);
  } catch (error: any) {
    console.error('Error fetching incidents:', error);
    // Return empty array instead of error if it's a resource not found
    if (error.code === 'ResourceNotFoundException') {
      return res.json([]);
    }
    res.status(500).json({ error: error.message || 'Failed to fetch incidents' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const incident = await getIncident(req.params.id);
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }
    res.json(incident);
  } catch (error: any) {
    console.error('Error fetching incident:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch incident' });
  }
});

export default router;

