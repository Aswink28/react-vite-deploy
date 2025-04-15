import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import './DashboardCards.css';

const DashboardCards = () => {
  const { filteredData } = useDashboard();

  const metrics = {
    totalClients: new Set(filteredData.map(item => item.Client)).size,
    totalUnits: filteredData.reduce((sum, item) => sum + (item.Total_Units || 0), 0),
    totalTaskDuration: filteredData.reduce((sum, item) => sum + (item.Task_Duration || 0), 0),
    totalEmployees: new Set(filteredData.map(item => item.Employee)).size,
    totalTasks: new Set(filteredData.map(item => item.Task_Description)).size,
    totalHours: filteredData.reduce((sum, item) => sum + (item.Task_Duration_by_Hour || 0), 0),
    productivity: 7300,
    nonProductivity: 2510
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(2).replace(/\.?0+$/, '')}K`; // "4.7K" not "4.70K"
    }
    return num.toString();
  };

  // First row cards (5 items)
  const firstRowCards = [
    { label: 'TOTAL CLIENT', value: metrics.totalClients },
    { label: 'TOTAL EMPLOYEE', value: metrics.totalEmployees },
    { label: 'TASK DESCRIPTION', value: metrics.totalTasks },
    { label: 'TOTAL HOURS', value: metrics.totalHours },
    { label: 'TOTAL TASK DURATION', value: metrics.totalTaskDuration }
  ];

  // Second row cards (3 items)
  const secondRowCards = [
    { label: 'PRODUCTIVITY', value: metrics.productivity },
    { label: 'TOTAL UNITS', value: metrics.totalUnits },
    { label: 'NON-PRODUCTIVITY', value: metrics.nonProductivity }
  ];

  return (
    <div className="dashboard-cards-container">
      {/* First row - 5 cards */}
      <div className="first-row">
        {firstRowCards.map((card, index) => (
          <div key={`first-${index}`} className="dashboard-card">
            <div className="card-value">{formatNumber(card.value)}</div>
            <div className="card-label">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Second row - 3 cards */}
      <div className="second-row">
        {secondRowCards.map((card, index) => (
          <div key={`second-${index}`} className="dashboard-card">
            <div className="card-value">{formatNumber(card.value)}</div>
            <div className="card-label">{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardCards;
