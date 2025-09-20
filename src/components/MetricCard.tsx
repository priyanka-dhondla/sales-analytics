import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  icon: Icon,
  color = 'blue'
}) => {
  const colorClasses = {
    blue: 'bg-blue-500 text-blue-600 bg-blue-50',
    green: 'bg-green-500 text-green-600 bg-green-50',
    amber: 'bg-amber-500 text-amber-600 bg-amber-50',
    red: 'bg-red-500 text-red-600 bg-red-50',
    purple: 'bg-purple-500 text-purple-600 bg-purple-50'
  };

  const [iconBg, textColor, cardBg] = colorClasses[color].split(' ');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className={`p-2 rounded-lg ${iconBg}`}>
              <Icon className={`h-5 w-5 text-white`} />
            </div>
            <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">{title}</h3>
          </div>
          
          <div className="flex items-end space-x-2">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            
            {change && (
              <div className={`
                flex items-center px-2 py-1 rounded-full text-xs font-medium
                ${change.type === 'increase' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
                }
              `}>
                <span className={`mr-1 ${change.type === 'increase' ? '↗' : '↘'}`}>
                  {change.type === 'increase' ? '↗' : '↘'}
                </span>
                {Math.abs(change.value)}%
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;