import React from 'react';
import { DashboardProvider } from './context/DashboardContext';
import ClientGroup from './components/ClientGroup';
import DashboardCards from './components/DashboardCards';
import { PieChart, BarChart } from './components/charts';
import './App.css';
import DonutChart from './components/charts/DonutChart/DonutChart';
import DonutChart2 from './components/charts/DonutChart2/DonutChart';
import LineChart from './components/charts/LineChart/LineChart';

const App = () => {
  return (
    <DashboardProvider>
      <div className="app-container">
        <div className="dashboard-grid">
          <div className="client-group-section">
            <ClientGroup />
          </div>
          <div className="metrics-section">
            <DashboardCards />
          </div>
          <div className="charts-section">
            <div className="pie-chart-container">
                <DonutChart/>
            </div>
            <div className="bar-chart-container">
              <BarChart />
            </div>
          </div>
          <div className="charts-section">
            <div className="pie-chart-container">
              <PieChart/>
            </div>
            <div className="bar-chart-container">
              <BarChart/>
            </div>
          </div>
          <div className="charts-section">
            <div className="pie-chart-container">
            <DonutChart2/>
            </div>
            <div className="bar-chart-container">
              <LineChart/> 
            </div>
          </div>
          
        </div>
      </div>
    </DashboardProvider>
  );
};

export default App;