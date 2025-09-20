import express from 'express';
import { Customer } from '../models/Customer.js';

const router = express.Router();

// Get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find({});
    
    res.json({
      success: true,
      data: customers,
      count: customers.length
    });

  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({
      error: 'Failed to fetch customers',
      details: error.message
    });
  }
});

export default router;