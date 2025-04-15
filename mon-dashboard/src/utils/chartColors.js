export const clientGroupColors = {
    'ARTICLE': '#4e79a7',       // blue
    'FOUNDER': '#f28e2b',       // orange
    'COMPANY': '#e15759',       // red
    'INDIVIDUAL': '#76b7b2',    // teal
    'CORPORATE': '#59a14f',     // green
    'LIMITED LIABILITY': '#edc948' // yellow
  };
  
  export const getChartColors = (labels, activeFilter) => {
    return labels.map(label => {
      if (activeFilter && label === activeFilter) {
        return clientGroupColors[label] || '#bab0ac';
      }
      return activeFilter ? '#e0e0e0' : clientGroupColors[label] || '#bab0ac';
    });
  };