import React from 'react';
import ReactECharts from 'echarts-for-react';

interface RevenueChartProps {
  data: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      },
      formatter: (params: any) => {
        const revenueItem = params.find((p: any) => p.seriesName === 'Revenue');
        const ordersItem = params.find((p: any) => p.seriesName === 'Orders');
        
        return `
          <div style="padding: 8px;">
            <strong>${revenueItem?.name}</strong><br/>
            Revenue: $${revenueItem?.value?.toLocaleString() || 0}<br/>
            Orders: ${ordersItem?.value || 0}
          </div>
        `;
      }
    },
    legend: {
      data: ['Revenue', 'Orders']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: data.map(item => item.date)
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: 'Revenue ($)',
        position: 'left',
        axisLabel: {
          formatter: '${value}'
        }
      },
      {
        type: 'value',
        name: 'Orders',
        position: 'right',
        axisLabel: {
          formatter: '{value}'
        }
      }
    ],
    series: [
      {
        name: 'Revenue',
        type: 'line',
        yAxisIndex: 0,
        data: data.map(item => item.revenue),
        itemStyle: {
          color: '#10B981'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(16, 185, 129, 0.3)'
              },
              {
                offset: 1,
                color: 'rgba(16, 185, 129, 0.05)'
              }
            ]
          }
        }
      },
      {
        name: 'Orders',
        type: 'line',
        yAxisIndex: 1,
        data: data.map(item => item.orders),
        itemStyle: {
          color: '#3B82F6'
        }
      }
    ]
  };

  return (
    <ReactECharts 
      option={option} 
      style={{ height: '400px', width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
};

export default RevenueChart;