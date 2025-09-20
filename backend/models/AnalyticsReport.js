export const AnalyticsReportSchema = {
  _id: String,
  reportDate: Date,
  startDate: Date,
  endDate: Date,
  totalOrders: Number,
  totalRevenue: Number,
  avgOrderValue: Number,
  topProducts: [{
    productId: String,
    productName: String,
    totalSold: Number,
    revenue: Number
  }],
  topCustomers: [{
    customerId: String,
    customerName: String,
    totalSpent: Number,
    orderCount: Number
  }],
  regionWiseStats: [{
    region: String,
    orderCount: Number,
    revenue: Number,
    avgOrderValue: Number
  }],
  categoryWiseStats: [{
    category: String,
    orderCount: Number,
    revenue: Number,
    avgOrderValue: Number
  }],
  createdAt: Date
};

export class AnalyticsReport {
  static async create(reportData) {
    const { db } = await import('../config/database.js');
    return await db.insertOne('analytics_reports', reportData);
  }

  static async find(query = {}) {
    const { db } = await import('../config/database.js');
    return await db.find('analytics_reports', query);
  }

  static async aggregate(pipeline) {
    const { db } = await import('../config/database.js');
    return await db.aggregate('analytics_reports', pipeline);
  }
}