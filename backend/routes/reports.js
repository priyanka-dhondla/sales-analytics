import express from 'express';
import { AnalyticsReport } from '../models/AnalyticsReport.js';

const router = express.Router();

// Get all analytics reports
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const reports = await AnalyticsReport.find({});
    
    // Sort by creation date (most recent first)
    const sortedReports = reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Implement pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedReports = sortedReports.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedReports,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(reports.length / limit),
        totalReports: reports.length,
        hasNext: endIndex < reports.length,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({
      error: 'Failed to fetch reports',
      details: error.message
    });
  }
});

// Get specific analytics report
router.get('/:id', async (req, res) => {
  try {
    const reports = await AnalyticsReport.find({ _id: req.params.id });
    const report = reports[0];

    if (!report) {
      return res.status(404).json({
        error: 'Report not found'
      });
    }

    res.json({
      success: true,
      data: report
    });

  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({
      error: 'Failed to fetch report',
      details: error.message
    });
  }
});

export default router;