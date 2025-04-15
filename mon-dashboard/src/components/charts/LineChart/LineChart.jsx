import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { useDashboard } from '../../../context/DashboardContext';
import { getChartColors } from '../../../utils/chartColors';
import { defaultChartOptions } from '../../../utils/chartOptions';
import './LineChart.css';

const LineChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const { filteredData, activeFilter } = useDashboard();

  useEffect(() => {
    if (!filteredData.length || !chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (chartInstance.current) chartInstance.current.destroy();

    const clientGroups = [...new Set(filteredData.map(item => item.Client_Group))];

    const labels = clientGroups;
    const dataPoints = clientGroups.map(group =>
      filteredData.filter(item => item.Client_Group === group)
        .reduce((sum, item) => sum + (item.Total_Units || 0), 0)
    );

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Total Units',
          data: dataPoints,
          fill: false,
          tension: 0.3,
          backgroundColor: getChartColors(clientGroups, activeFilter)[0],
          borderColor: getChartColors(clientGroups, activeFilter)[0],
          pointBackgroundColor: '#fff',
          pointBorderColor: getChartColors(clientGroups, activeFilter)[0],
          borderWidth: 2,
          pointRadius: 4
        }]
      },
      options: {
        ...defaultChartOptions,
        scales: {
          y: {
            ticks: {
              callback: value => value >= 1000 ? `${value / 1000}k` : value,
              font: { size: 10 }
            }
          },
          x: {
            ticks: {
              font: { size: 10 }
            }
          }
        }
      }
    });

    return () => chartInstance.current?.destroy();
  }, [filteredData, activeFilter]);

  return (
    <div className="line-chart-container">
      <h5>Client Group Trends</h5>
      <div className="chart-wrapper">
        <canvas ref={chartRef} />
      </div>
    </div>
  );
};

export default LineChart;
