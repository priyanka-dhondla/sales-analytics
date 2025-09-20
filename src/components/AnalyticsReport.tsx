import React from 'react';
import { TrendingUp, Users, ShoppingBag, MapPin } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

interface AnalyticsReportProps {
  data: {
    totalOrders: number;
    totalRevenue: number;
    avgOrderValue: number;
    topProducts: Array<{
      productId: string;
      productName: string;
      totalSold: number;
      revenue: number;
    }>;
    topCustomers: Array<{
      customerId: string;
      customerName: string;
      totalSpent: number;
      orderCount: number;
    }>;
    regionWiseStats: Array<{
      region: string;
      orderCount: number;
      revenue: number;
      avgOrderValue: number;
    }>;
    categoryWiseStats: Array<{
      category: string;
      orderCount: number;
      revenue: number;
      avgOrderValue: number;
    }>;
    startDate: string;
    endDate: string;
  };
}

const AnalyticsReport: React.FC<AnalyticsReportProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  // Chart options for regional stats
  const regionChartOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: 'Revenue by Region',
        type: 'pie',
        radius: '50%',
        data: data.regionWiseStats.map(region => ({
          value: region.revenue,
          name: region.region
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  // Chart options for category stats
  const categoryChartOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.categoryWiseStats.map(cat => cat.category),
      axisLabel: {
        interval: 0,
        rotate: 45,
        fontSize: 11
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '${value}'
      }
    },
    series: [
      {
        name: 'Revenue',
        type: 'bar',
        data: data.categoryWiseStats.map(cat => cat.revenue),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#8B5CF6'
              },
              {
                offset: 1,
                color: '#7C3AED'
              }
            ]
          }
        }
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="p-2 bg-blue-100 rounded-lg w-12 h-12 mx-auto mb-4 flex items-center justify-center">
            <ShoppingBag className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatNumber(data.totalOrders)}</p>
          <p className="text-gray-600 mt-2">Total Orders</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="p-2 bg-green-100 rounded-lg w-12 h-12 mx-auto mb-4 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(data.totalRevenue)}</p>
          <p className="text-gray-600 mt-2">Total Revenue</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="p-2 bg-purple-100 rounded-lg w-12 h-12 mx-auto mb-4 flex items-center justify-center">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-purple-600">{formatCurrency(data.avgOrderValue)}</p>
          <p className="text-gray-600 mt-2">Average Order Value</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Region</h3>
          <ReactECharts 
            option={regionChartOption} 
            style={{ height: '300px', width: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
          <ReactECharts 
            option={categoryChartOption} 
            style={{ height: '300px', width: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sold
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.topProducts.slice(0, 10).map((product, index) => (
                  <tr key={product.productId} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.productName}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatNumber(product.totalSold)}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">{formatCurrency(product.revenue)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Customers</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Spent
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.topCustomers.slice(0, 10).map((customer, index) => (
                  <tr key={customer.customerId} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{customer.customerName}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatNumber(customer.orderCount)}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">{formatCurrency(customer.totalSpent)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Regional Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Region
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Order Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.regionWiseStats.map((region, index) => (
                <tr key={region.region} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <div className="text-sm font-medium text-gray-900">{region.region}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatNumber(region.orderCount)}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">{formatCurrency(region.revenue)}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(region.avgOrderValue)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsReport;