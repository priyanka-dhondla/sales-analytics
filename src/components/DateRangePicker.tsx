import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateChange: (start: Date | null, end: Date | null) => void;
  disabled?: boolean;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onDateChange,
  disabled = false
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (date: Date | null) => {
    return date ? format(date, 'MMM dd, yyyy') : 'Select date';
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    onDateChange(date, endDate);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    onDateChange(startDate, date);
  };

  const presetRanges = [
    {
      label: 'Last 7 days',
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      end: new Date()
    },
    {
      label: 'Last 30 days',
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date()
    },
    {
      label: 'Last 90 days',
      start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      end: new Date()
    },
    {
      label: 'Last 6 months',
      start: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      end: new Date()
    }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => !disabled && setShowPicker(!showPicker)}
        disabled={disabled}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <Calendar className="h-4 w-4 text-gray-500" />
        <span className="text-sm text-gray-700">
          {startDate && endDate 
            ? `${formatDate(startDate)} - ${formatDate(endDate)}`
            : 'Select date range'
          }
        </span>
      </button>

      {showPicker && (
        <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4 min-w-80">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
                  onChange={handleStartDateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
                  onChange={handleEndDateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-3">
              <h4 className="text-xs font-medium text-gray-700 mb-2">Quick Select</h4>
              <div className="grid grid-cols-2 gap-2">
                {presetRanges.map((range, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      onDateChange(range.start, range.end);
                      setShowPicker(false);
                    }}
                    className="text-left px-3 py-2 text-xs bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-gray-200">
              <button
                onClick={() => setShowPicker(false)}
                className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowPicker(false)}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;