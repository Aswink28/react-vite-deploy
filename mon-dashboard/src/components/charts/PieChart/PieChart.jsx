import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { useDashboard } from '../../../context/DashboardContext';
import { getChartColors } from '../../../utils/chartColors';
import { defaultChartOptions } from '../../../utils/chartOptions';
import './PieChart.css';

const PieChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const { filteredData, activeFilter } = useDashboard();

  useEffect(() => {
    if (!filteredData.length || !chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (chartInstance.current) chartInstance.current.destroy();

    const clientGroups = [...new Set(filteredData.map(item => item.Client_Group))];
    const dataValues = clientGroups.map(group =>
      filteredData.filter(item => item.Client_Group === group).length
    );

    chartInstance.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: clientGroups,
        datasets: [{
          data: dataValues,
          backgroundColor: getChartColors(clientGroups, activeFilter),
          borderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: defaultChartOptions
    });

    return () => chartInstance.current?.destroy();
  }, [filteredData, activeFilter]);

  return (
    <div className="pie-chart-container">
      <h5>Client Distribution</h5>
      <div className="chart-wrapper">
        <canvas ref={chartRef} />
      </div>
    </div>
  );
};

export default PieChart;