export const OrderSchema = {
  _id: String,
  customerId: String,
  orderDate: Date,
  status: String, // 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
  items: [{
    productId: String,
    quantity: Number,
    unitPrice: Number,
    totalPrice: Number
  }],
  totalAmount: Number,
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  region: String,
  paymentMethod: String,
  createdAt: Date,
  updatedAt: Date
};

export class Order {
  static async create(orderData) {
    const { db } = await import('../config/database.js');
    return await db.insertOne('orders', orderData);
  }

  static async find(query = {}) {
    const { db } = await import('../config/database.js');
    return await db.find('orders', query);
  }

  static async aggregate(pipeline) {
    const { db } = await import('../config/database.js');
    return await db.aggregate('orders', pipeline);
  }
}