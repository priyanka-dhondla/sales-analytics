import express from 'express';
import { Order } from '../models/Order.js';

const router = express.Router();

// Get all orders with filtering
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate, status, region } = req.query;
    let query = {};

    if (startDate && endDate) {
      query.orderDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (status) query.status = status;
    if (region) query.region = region;

    const orders = await Order.find(query);
    
    res.json({
      success: true,
      data: orders,
      count: orders.length
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      error: 'Failed to fetch orders',
      details: error.message
    });
  }
});

// Get orders summary
router.get('/summary', async (req, res) => {
  try {
    const orders = await Order.find({});
    
    const summary = {
      totalOrders: orders.length,
      statusBreakdown: {},
      regionBreakdown: {}
    };

    // Calculate status breakdown
    orders.forEach(order => {
      summary.statusBreakdown[order.status] = (summary.statusBreakdown[order.status] || 0) + 1;
      summary.regionBreakdown[order.region] = (summary.regionBreakdown[order.region] || 0) + 1;
    });

    res.json({
      success: true,
      data: summary
    });

  } catch (error) {
    console.error('Error fetching orders summary:', error);
    res.status(500).json({
      error: 'Failed to fetch orders summary',
      details: error.message
    });
  }
});

export default router;