export const CustomerSchema = {
  _id: String,
  name: String,
  email: String,
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  customerType: String, // 'individual', 'business'
  registrationDate: Date,
  totalSpent: Number,
  region: String,
  createdAt: Date,
  updatedAt: Date
};

export class Customer {
  static async create(customerData) {
    const { db } = await import('../config/database.js');
    return await db.insertOne('customers', customerData);
  }

  static async find(query = {}) {
    const { db } = await import('../config/database.js');
    return await db.find('customers', query);
  }

  static async aggregate(pipeline) {
    const { db } = await import('../config/database.js');
    return await db.aggregate('customers', pipeline);
  }
}