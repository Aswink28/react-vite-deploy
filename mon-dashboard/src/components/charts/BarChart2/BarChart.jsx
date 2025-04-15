import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { useDashboard } from '../../../context/DashboardContext';
import { getChartColors } from '../../../utils/chartColors';
import { defaultChartOptions } from '../../../utils/chartOptions';
import './BarChart.css';

const BarChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const { filteredData, activeFilter } = useDashboard();

  useEffect(() => {
    if (!filteredData.length || !chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (chartInstance.current) chartInstance.current.destroy();

    const clientGroups = [...new Set(filteredData.map(item => item.Client_Group))];
    const totalUnits = clientGroups.map(group =>
      filteredData.filter(item => item.Client_Group === group)
        .reduce((sum, item) => sum + (item.Total_Units || 0), 0)
    );

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: clientGroups,
        datasets: [{
          label: 'Total Units',
          data: totalUnits,
          backgroundColor: getChartColors(clientGroups, activeFilter),
          borderColor: '#fff',
          borderWidth: 1
        }]
      },
      options: {
        ...defaultChartOptions,
        scales: {
          x: {
            beginAtZero: true
          },
          y: {
            beginAtZero: true
          }
        }
      }
    });

    return () => chartInstance.current?.destroy();
  }, [filteredData, activeFilter]);

  return (
    <div className="bar-chart-container">
      <h5>Units by Client Group</h5>
      <div className="chart-wrapper">
        <canvas ref={chartRef} />
      </div>
    </div>
  );
};

export default BarChart;
