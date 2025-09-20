import express from 'express';
import { generateAnalytics, getDashboardSummary } from '../controllers/analyticsController.js';

const router = express.Router();

// Generate analytics report for date range
router.get('/generate', generateAnalytics);

// Get dashboard summary
router.get('/summary', getDashboardSummary);

export default router;