import React from 'react';
import ReactECharts from 'echarts-for-react';

interface TopProductsChartProps {
  data: Array<{
    productName: string;
    revenue: number;
    totalSold: number;
  }>;
}

const TopProductsChart: React.FC<TopProductsChartProps> = ({ data }) => {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        const item = params[0];
        return `
          <div style="padding: 8px;">
            <strong>${item.name}</strong><br/>
            Revenue: $${item.value.toLocaleString()}<br/>
            Units Sold: ${data[item.dataIndex]?.totalSold || 0}
          </div>
        `;
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
      data: data.map(item => item.productName),
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
        data: data.map(item => item.revenue),
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
                color: '#3B82F6'
              },
              {
                offset: 1,
                color: '#1D4ED8'
              }
            ]
          }
        },
        emphasis: {
          itemStyle: {
            color: '#2563EB'
          }
        }
      }
    ]
  };

  return (
    <ReactECharts 
      option={option} 
      style={{ height: '300px', width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
};

export default TopProductsChart;