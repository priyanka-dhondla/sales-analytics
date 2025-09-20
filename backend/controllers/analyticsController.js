import { Order } from "../models/Order.js";
import { Customer } from "../models/Customer.js";
import { Product } from "../models/Product.js";
import { AnalyticsReport } from "../models/AnalyticsReport.js";

export const generateAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        error: "Start date and end date are required",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // End of day

    // Generate comprehensive analytics using aggregation pipelines
    const analytics = await Promise.all([
      generateRevenueAnalytics(start, end),
      generateTopProducts(start, end),
      generateTopCustomers(start, end),
      generateRegionWiseStats(start, end),
      generateCategoryWiseStats(start, end),
    ]);

    const [
      revenueData,
      topProducts,
      topCustomers,
      regionWiseStats,
      categoryWiseStats,
    ] = analytics;

    const reportData = {
      reportDate: new Date(),
      startDate: start,
      endDate: end,
      totalOrders: revenueData.totalOrders,
      totalRevenue: revenueData.totalRevenue,
      avgOrderValue: revenueData.avgOrderValue,
      topProducts: topProducts.slice(0, 10),
      topCustomers: topCustomers.slice(0, 10),
      regionWiseStats,
      categoryWiseStats,
    };

    // Save the analytics report
    const savedReport = await AnalyticsReport.create(reportData);

    res.json({
      success: true,
      data: savedReport,
      message: "Analytics report generated successfully",
    });
  } catch (error) {
    console.error("Error generating analytics:", error);
    res.status(500).json({
      error: "Failed to generate analytics report",
      details: error.message,
    });
  }
};

// Revenue analytics aggregation pipeline
async function generateRevenueAnalytics(startDate, endDate) {
  const pipeline = [
    {
      $match: {
        orderDate: {
          $gte: startDate,
          $lte: endDate,
        },
        status: { $in: ["delivered", "shipped"] },
      },
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
        avgOrderValue: { $avg: "$totalAmount" },
      },
    },
  ];

  const result = await Order.aggregate(pipeline);
  return result[0] || { totalOrders: 0, totalRevenue: 0, avgOrderValue: 0 };
}

// Top products aggregation pipeline
async function generateTopProducts(startDate, endDate) {
  const pipeline = [
    {
      $match: {
        orderDate: { $gte: startDate, $lte: endDate },
        status: { $in: ["delivered", "shipped"] },
      },
    },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.productId",
        totalSold: { $sum: "$items.quantity" },
        revenue: { $sum: "$items.totalPrice" },
      },
    },
    { $sort: { revenue: -1 } },
  ];

  const productStats = await Order.aggregate(pipeline);

  const products = await Product.find({});

  const productMap = {};
  products.forEach((p) => {
    productMap[p._id.toString()] = p.name;
  });

  return productStats.map((stat) => {
    const productName = productMap[stat._id.toString()] || "Unknown Product";
    return {
      productId: stat._id.toString(),
      productName,
      totalSold: stat.totalSold,
      revenue: stat.revenue,
    };
  });
}

// Top customers aggregation pipeline
async function generateTopCustomers(startDate, endDate) {
  const pipeline = [
    {
      $match: {
        orderDate: { $gte: startDate, $lte: endDate },
        status: { $in: ["delivered", "shipped"] },
      },
    },
    {
      $group: {
        _id: "$customerId",
        totalSpent: { $sum: "$totalAmount" },
        orderCount: { $sum: 1 },
      },
    },
    {
      $sort: { totalSpent: -1 },
    },
  ];

  const customerStats = await Order.aggregate(pipeline);
  const customers = await Customer.find({});

  // Build a map of customerId -> name for faster lookup
  const customerMap = {};
  customers.forEach((c) => {
    customerMap[c._id.toString()] = c.name;
  });

  return customerStats.map((stat) => {
    const customerName = customerMap[stat._id.toString()] || "Unknown Customer";
    return {
      customerId: stat._id.toString(),
      customerName,
      totalSpent: stat.totalSpent,
      orderCount: stat.orderCount,
    };
  });
}

// Region-wise statistics aggregation pipeline
async function generateRegionWiseStats(startDate, endDate) {
  const pipeline = [
    {
      $match: {
        orderDate: {
          $gte: startDate,
          $lte: endDate,
        },
        status: { $in: ["delivered", "shipped"] },
      },
    },
    {
      $group: {
        _id: "$region",
        orderCount: { $sum: 1 },
        revenue: { $sum: "$totalAmount" },
        avgOrderValue: { $avg: "$totalAmount" },
      },
    },
    {
      $sort: { revenue: -1 },
    },
  ];

  const result = await Order.aggregate(pipeline);
  return result.map((item) => ({
    region: item._id,
    orderCount: item.orderCount,
    revenue: item.revenue,
    avgOrderValue: Math.round(item.avgOrderValue * 100) / 100,
  }));
}

// Category-wise statistics aggregation pipeline
async function generateCategoryWiseStats(startDate, endDate) {
  const pipeline = [
    {
      $match: {
        orderDate: {
          $gte: startDate,
          $lte: endDate,
        },
        status: { $in: ["delivered", "shipped"] },
      },
    },
    {
      $unwind: "$items",
    },
    {
      $lookup: {
        from: "products",
        localField: "items.productId",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
    {
      $group: {
        _id: "$product.category",
        orderCount: { $sum: 1 },
        revenue: { $sum: "$items.totalPrice" },
        avgOrderValue: { $avg: "$items.totalPrice" },
      },
    },
    {
      $sort: { revenue: -1 },
    },
  ];

  const result = await Order.aggregate(pipeline);
  return result.map((item) => ({
    category: item._id,
    orderCount: item.orderCount,
    revenue: item.revenue,
    avgOrderValue: Math.round(item.avgOrderValue * 100) / 100,
  }));
}

export const getDashboardSummary = async (req, res) => {
  try {
    const { period = "30" } = req.query;
    const days = parseInt(period);

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const summary = await generateRevenueAnalytics(startDate, endDate);
    const topProducts = await generateTopProducts(startDate, endDate);
    const regionStats = await generateRegionWiseStats(startDate, endDate);

    res.json({
      success: true,
      data: {
        ...summary,
        topProducts: topProducts.slice(0, 5),
        regionStats: regionStats.slice(0, 5),
        period: days,
      },
    });
  } catch (error) {
    console.error("Error getting dashboard summary:", error);
    res.status(500).json({
      error: "Failed to get dashboard summary",
      details: error.message,
    });
  }
};
