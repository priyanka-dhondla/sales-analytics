export const ProductSchema = {
  _id: String,
  name: String,
  description: String,
  category: String,
  price: Number,
  costPrice: Number,
  stockQuantity: Number,
  sku: String,
  brand: String,
  tags: [String],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
};

export class Product {
  static async create(productData) {
    const { db } = await import('../config/database.js');
    return await db.insertOne('products', productData);
  }

  static async find(query = {}) {
    const { db } = await import('../config/database.js');
    return await db.find('products', query);
  }

  static async aggregate(pipeline) {
    const { db } = await import('../config/database.js');
    return await db.aggregate('products', pipeline);
  }
}