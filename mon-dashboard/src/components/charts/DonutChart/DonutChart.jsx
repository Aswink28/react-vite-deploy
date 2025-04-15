// import React, { useEffect, useRef } from 'react';
// import { Chart } from 'chart.js/auto';
// import { useDashboard } from '../../../context/DashboardContext';
// import { getChartColors } from '../../../utils/chartColors';
// import { defaultChartOptions } from '../../../utils/chartOptions';
// import './DonutChart.css';

// const DonutChart = () => {
//   const chartRef = useRef(null);
//   const chartInstance = useRef(null);
//   const { filteredData, activeFilter } = useDashboard();

//   useEffect(() => {
//     if (!filteredData.length || !chartRef.current) return;

//     const ctx = chartRef.current.getContext('2d');
//     if (chartInstance.current) chartInstance.current.destroy();

//     const clientGroups = [...new Set(filteredData.map(item => item.Client_Group))];
//     const totalUnits = clientGroups.map(group =>
//       filteredData.filter(item => item.Client_Group === group)
//         .reduce((sum, item) => sum + (item.Total_Units || 0), 0)
//     );

//     chartInstance.current = new Chart(ctx, {
//       type: 'doughnut',
//       data: {
//         labels: clientGroups,
//         datasets: [{
//           data: totalUnits,
//           backgroundColor: getChartColors(clientGroups, activeFilter),
//           borderColor: '#fff',
//           borderWidth: 2,
//           cutout: '70%'
//         }]
//       },
//       options: defaultChartOptions
//     });

//     return () => chartInstance.current?.destroy();
//   }, [filteredData, activeFilter]);

//   return (
//     <div className="donut-chart-container">
//       <h5>Client Group Distribution</h5>
//       <div className="chart-wrapper">
//         <canvas ref={chartRef} />
//       </div>
//     </div>
//   );
// };

// export default DonutChart;
import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { useDashboard } from '../../../context/DashboardContext';
import { getChartColors } from '../../../utils/chartColors';
import { defaultChartOptions } from '../../../utils/chartOptions';
import './DonutChart.css';

const DonutChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const { filteredData, activeFilter } = useDashboard();

  // Silver shimmer illusion plugin
  const silverDonutShine = {
    id: 'silverDonutShine',
    afterDatasetDraw(chart) {
      const { ctx } = chart;
      const meta = chart.getDatasetMeta(0);
      const time = (Date.now() % 3000) / 3000;
      const offset = (1 - time) * 300;

      meta.data.forEach((arc) => {
        const { x, y } = arc;
        const gradient = ctx.createLinearGradient(
          x + offset, y + offset,
          x - offset, y - offset
        );
        gradient.addColorStop(0, 'rgba(255,255,255, 0)');
        gradient.addColorStop(0.4, 'rgba(192,192,192, 0.2)');
        gradient.addColorStop(0.5, 'rgba(255,255,255, 0.4)');
        gradient.addColorStop(0.6, 'rgba(192,192,192, 0.2)');
        gradient.addColorStop(1, 'rgba(255,255,255, 0)');

        ctx.save();
        ctx.fillStyle = gradient;
        ctx.beginPath();
        arc.draw(ctx);
        ctx.fill();
        ctx.restore();
      });
    }
  };

  useEffect(() => {
    if (!filteredData.length || !chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (chartInstance.current) chartInstance.current.destroy();

    const clientGroups = [...new Set(filteredData.map(item => item.Client_Group))];
    const totalUnits = clientGroups.map(group =>
      filteredData
        .filter(item => item.Client_Group === group)
        .reduce((sum, item) => sum + (item.Total_Units || 0), 0)
    );

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: clientGroups,
        datasets: [{
          data: totalUnits,
          backgroundColor: getChartColors(clientGroups, activeFilter),
          borderColor: '#fff',
          borderWidth: 2,
          hoverOffset: 18,
          cutout: '70%'
        }]
      },
      options: {
        ...defaultChartOptions,
        cutout: '60%',
        responsive: true
      },
      plugins: [silverDonutShine]
    });

    // Animate the silver shimmer
    const shimmerLoop = () => {
      if (chartInstance.current) {
        chartInstance.current.draw();
        requestAnimationFrame(shimmerLoop);
      }
    };
    shimmerLoop();

    return () => chartInstance.current?.destroy();
  }, [filteredData, activeFilter]);

  return (
    <div className="donut-chart-container">
      <h5>Client Group Distribution</h5>
      <div className="chart-wrapper">
        <canvas ref={chartRef} />
      </div>
    </div>
  );
};

export default DonutChart;
