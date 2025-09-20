import express from 'express';
import { Product } from '../models/Product.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    
    res.json({
      success: true,
      data: products,
      count: products.length
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      error: 'Failed to fetch products',
      details: error.message
    });
  }
});

export default router;