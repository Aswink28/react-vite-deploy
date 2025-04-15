import React, { createContext, useState, useContext, useEffect } from 'react';
import dashboardData from '../assets/data/dashboardData.json';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      // Using mock data for demo
      setAllData(dashboardData);
      setFilteredData(dashboardData);
      setActiveFilter(null);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const filterData = (clientGroup) => {
    if (clientGroup === 'ALL' || activeFilter === clientGroup) {
      setFilteredData(allData);
      setActiveFilter(null);
    } else {
      const filtered = allData.filter(item => item.Client_Group === clientGroup);
      setFilteredData(filtered);
      setActiveFilter(clientGroup);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DashboardContext.Provider value={{
      allData,
      filteredData,
      filterData,
      refreshData: fetchData,
      isRefreshing,
      activeFilter
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);