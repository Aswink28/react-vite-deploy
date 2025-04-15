import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { useDashboard } from '../../../context/DashboardContext';
import { getChartColors } from '../../../utils/chartColors';
import { defaultChartOptions } from '../../../utils/chartOptions';
import './BarChart.css';

Chart.register(...registerables);

const BarChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const { filteredData, activeFilter } = useDashboard();
  const hoveredIndexRef = useRef(null);
  const animatedValuesRef = useRef([]);
  const animationStartRef = useRef(null);
  const animationDoneRef = useRef(false);

  // Silver shimmer illusion
  const silverIllusion = {
    id: 'silverIllusion',
    afterDatasetDraw(chart) {
      const { ctx } = chart;
      const meta = chart.getDatasetMeta(0);
      const now = Date.now();
      const time = (now % 3000) / 3000;

      meta.data.forEach((bar) => {
        const { x, y, base } = bar;
        const width = bar.width;
        const height = base - y;
        const shineOffset = (1 - time) * (width + height);

        const x0 = x + shineOffset;
        const y0 = base + shineOffset;
        const x1 = x - width - height + shineOffset;
        const y1 = y - width - height + shineOffset;

        const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
        gradient.addColorStop(0, 'rgba(230,230,230, 0)');
        gradient.addColorStop(0.2, 'rgba(192,192,192, 0.15)');
        gradient.addColorStop(0.5, 'rgba(255,255,255, 0.5)');
        gradient.addColorStop(0.8, 'rgba(192,192,192, 0.15)');
        gradient.addColorStop(1, 'rgba(230,230,230, 0)');

        ctx.save();
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x - width / 2, y, width, height, 6);
        ctx.fill();
        ctx.restore();
      });
    }
  };

  // Hover zoom effect
  const hoverZoom = {
    id: 'hoverZoom',
    afterDatasetsDraw(chart) {
      const { ctx } = chart;
      const meta = chart.getDatasetMeta(0);
      const hoveredIndex = hoveredIndexRef.current;

      meta.data.forEach((bar, index) => {
        const { x, y, base } = bar;
        const width = index === hoveredIndex ? bar.width * 1.1 : bar.width;
        const height = base - y;
        const adjustedX = index === hoveredIndex ? x - width / 2 : x - bar.width / 2;

        if (index === hoveredIndex) {
          ctx.save();
          ctx.fillStyle = chart.data.datasets[0].backgroundColor[index];
          ctx.beginPath();
          ctx.roundRect(adjustedX, y - 4, width, height + 8, 8);
          ctx.fill();
          ctx.restore();
        }
      });
    }
  };

  // Animated counter on top of bars
  const counterPlugin = {
    id: 'counterPlugin',
    afterDatasetsDraw(chart) {
      if (!chart || animationDoneRef.current) return;

      const { ctx } = chart;
      const meta = chart.getDatasetMeta(0);

      ctx.save();
      ctx.fillStyle = 'black';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';

      meta.data.forEach((bar, index) => {
        const val = animatedValuesRef.current[index];
        ctx.fillText(val.toFixed(1), bar.x, bar.y - 10);
      });

      ctx.restore();
    }
  };
  const clientGroups = [...new Set(filteredData.map(item => item.Client_Group))];

const totalUnits = clientGroups.map(group =>
  filteredData
    .filter(item => item.Client_Group === group)
    .reduce((sum, item) => sum + (item.Total_Units || 0), 0)
);

const maxUnit = Math.max(...(totalUnits.length ? totalUnits : [0]), 10);
const getRoundedMax = (value, step = 500) => {
  return Math.ceil(value / step) * step;
};

  useEffect(() => {
    if (!filteredData.length || !chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (chartInstance.current) chartInstance.current.destroy();

    const clientGroups = [...new Set(filteredData.map(item => item.Client_Group))];
    const finalData = clientGroups.map(group =>
      filteredData.filter(item => item.Client_Group === group)
        .reduce((sum, item) => sum + (item.Total_Units || 0), 0)
    );


    // Start with tiny values
    const startingValues = Array(finalData.length).fill(0.1);
    animatedValuesRef.current = [...startingValues];
    animationDoneRef.current = false;
    animationStartRef.current = null;
    

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: clientGroups,
        datasets: [{
          label: 'Total Units',
          data: [...startingValues],
          backgroundColor: getChartColors(clientGroups, activeFilter),
          borderColor: '#fff',
          borderWidth: 1,
          borderRadius: 8
        }]
      },
      options: {
        ...defaultChartOptions,
        responsive: true,
        animation: false,
        plugins: {
          tooltip: { enabled: false }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: { color: '#eee' }
          },
          y: {
            beginAtZero: true,
            max: getRoundedMax(maxUnit), // 20% padding above max bar
            grid: { color: '#ccc' },
            ticks: {
              precision: 0 // Only integers
            }
          }
        }
        ,
        onHover: (e, elements) => {
          hoveredIndexRef.current = elements.length ? elements[0].index : null;
        },
        interaction: {
          mode: 'nearest',
          intersect: true
        }
      },
      plugins: [silverIllusion, hoverZoom, counterPlugin]
    });

    const duration = 2000;

    // Animate heights and counters
    const animate = (timestamp) => {
      if (!animationStartRef.current) animationStartRef.current = timestamp;
      const progress = Math.min((timestamp - animationStartRef.current) / duration, 1);

      const newData = finalData.map((val, i) => {
        const animated = 0.1 + (val - 0.1) * progress;
        animatedValuesRef.current[i] = animated;
        return animated;
      });

      chartInstance.current.data.datasets[0].data = newData;
      chartInstance.current.update('none');

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        animationDoneRef.current = true;
        chartInstance.current.update();
      }
    };

    requestAnimationFrame(animate);

    // Loop shimmer
    const shimmerLoop = () => {
      chartInstance.current.draw();
      requestAnimationFrame(shimmerLoop);
    };
    shimmerLoop();

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
