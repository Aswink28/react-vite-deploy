export const defaultChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          padding: 20,
          font: {
            size: 10
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            const formatted = `${Math.round(value / 1000)}K`;
            return `${label}: ${formatted}`;
          }
        }
      }
    
    }
  };
  