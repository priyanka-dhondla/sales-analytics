import React, { useState } from 'react';
import { Calendar, Download, Play } from 'lucide-react';
import DateRangePicker from '../components/DateRangePicker';
import LoadingSpinner from '../components/LoadingSpinner';
import { apiService } from '../services/api';
import AnalyticsReport from '../components/AnalyticsReport';

const Analytics: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<any>(null);

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const generateReport = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    if (startDate > endDate) {
      setError('Start date cannot be after end date');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.generateAnalytics(startDate, endDate);
      setReportData(response.data);
      
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate analytics report');
      console.error('Analytics generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!reportData) return;

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-report-${reportData.startDate}-${reportData.endDate}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Sales Analytics</h1>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Date Range:</span>
            </div>
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onDateChange={handleDateChange}
              disabled={loading}
            />
          </div>

          <div className="flex items-center space-x-3">
            {reportData && (
              <button
                onClick={downloadReport}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
            )}
            
            <button
              onClick={generateReport}
              disabled={loading || !startDate || !endDate}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Play className="h-4 w-4" />
              <span>{loading ? 'Generating...' : 'Generate Report'}</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <LoadingSpinner message="Processing your analytics request..." />
        </div>
      )}

      {/* Report Results */}
      {reportData && !loading && (
        <AnalyticsReport data={reportData} />
      )}

      {/* Empty State */}
      {!reportData && !loading && !error && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="p-3 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Generate Your Analytics Report</h3>
            <p className="text-gray-600 mb-6">
              Select a date range and click "Generate Report" to get comprehensive insights into your sales data including revenue trends, top products, customer analytics, and regional performance.
            </p>
            <div className="text-sm text-gray-500">
              <p>• Revenue and order analytics</p>
              <p>• Top performing products and customers</p>
              <p>• Regional and category breakdowns</p>
              <p>• Exportable reports</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;