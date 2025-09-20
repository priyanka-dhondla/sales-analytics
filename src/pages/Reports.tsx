import React, { useState, useEffect } from 'react';
import { FileText, Clock, Download, Calendar, Eye } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { apiService } from '../services/api';
import { format } from 'date-fns';

interface Report {
  _id: string;
  reportDate: string;
  startDate: string;
  endDate: string;
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  createdAt: string;
}

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [viewingReport, setViewingReport] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getReports();
      setReports(response.data);
    } catch (err: any) {
      setError('Failed to load reports');
      console.error('Reports fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const viewReport = async (reportId: string) => {
    try {
      setViewingReport(true);
      const response = await apiService.getReport(reportId);
      setSelectedReport(response.data);
    } catch (err: any) {
      setError('Failed to load report details');
      console.error('Report view error:', err);
    } finally {
      setViewingReport(false);
    }
  };

  const downloadReport = (report: any) => {
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `report-${report._id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Reports History</h1>
        </div>
        <LoadingSpinner message="Loading reports..." />
      </div>
    );
  }

  if (error && !selectedReport) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Reports History</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchReports}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Reports History</h1>
        {selectedReport && (
          <button
            onClick={() => setSelectedReport(null)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back to List
          </button>
        )}
      </div>

      {selectedReport ? (
        <ReportDetailView 
          report={selectedReport} 
          onDownload={() => downloadReport(selectedReport)} 
        />
      ) : (
        <>
          {reports.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="p-3 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reports Yet</h3>
                <p className="text-gray-600">
                  Generate your first analytics report by visiting the Analytics page and selecting a date range.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Analytics Reports</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {reports.length} report{reports.length !== 1 ? 's' : ''} available
                </p>
              </div>

              <div className="divide-y divide-gray-200">
                {reports.map((report) => (
                  <div key={report._id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Analytics Report
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(report.startDate)} - {formatDate(report.endDate)}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>Generated {formatDate(report.createdAt)}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">{report.totalOrders}</p>
                            <p className="text-xs text-gray-600">Total Orders</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{formatCurrency(report.totalRevenue)}</p>
                            <p className="text-xs text-gray-600">Total Revenue</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">{formatCurrency(report.avgOrderValue)}</p>
                            <p className="text-xs text-gray-600">Avg Order Value</p>
                          </div>
                        </div>
                      </div>

                      <div className="ml-6 flex items-center space-x-2">
                        <button
                          onClick={() => viewReport(report._id)}
                          disabled={viewingReport}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                          title="View Report"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => downloadReport(report)}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Download Report"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const ReportDetailView: React.FC<{ report: any; onDownload: () => void }> = ({ 
  report, 
  onDownload 
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Analytics Report</h2>
            <p className="text-gray-600 mt-1">
              {formatDate(report.startDate)} - {formatDate(report.endDate)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Generated on {formatDate(report.createdAt)}
            </p>
          </div>
          <button
            onClick={onDownload}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <p className="text-3xl font-bold text-gray-900">{report.totalOrders}</p>
          <p className="text-gray-600 mt-2">Total Orders</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <p className="text-3xl font-bold text-green-600">{formatCurrency(report.totalRevenue)}</p>
          <p className="text-gray-600 mt-2">Total Revenue</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <p className="text-3xl font-bold text-blue-600">{formatCurrency(report.avgOrderValue)}</p>
          <p className="text-gray-600 mt-2">Average Order Value</p>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
          <div className="space-y-3">
            {report.topProducts?.slice(0, 5).map((product: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{product.productName}</p>
                  <p className="text-sm text-gray-500">{product.totalSold} sold</p>
                </div>
                <p className="font-semibold text-gray-900">
                  {formatCurrency(product.revenue)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Customers</h3>
          <div className="space-y-3">
            {report.topCustomers?.slice(0, 5).map((customer: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{customer.customerName}</p>
                  <p className="text-sm text-gray-500">{customer.orderCount} orders</p>
                </div>
                <p className="font-semibold text-gray-900">
                  {formatCurrency(customer.totalSpent)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Performance</h3>
          <div className="space-y-3">
            {report.regionWiseStats?.map((region: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{region.region}</p>
                  <p className="text-sm text-gray-500">{region.orderCount} orders</p>
                </div>
                <p className="font-semibold text-gray-900">
                  {formatCurrency(region.revenue)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Category Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
          <div className="space-y-3">
            {report.categoryWiseStats?.map((category: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{category.category}</p>
                  <p className="text-sm text-gray-500">{category.orderCount} orders</p>
                </div>
                <p className="font-semibold text-gray-900">
                  {formatCurrency(category.revenue)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;