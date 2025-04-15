import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faSyncAlt, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useDashboard } from '../../context/DashboardContext';
import './ClientGroup.css';

const ClientGroup = () => {
  const { filterData, isRefreshing, refreshData, activeFilter } = useDashboard();

  const clientGroups = [
    { label: 'ARTICLE', value: 'ARTICLE', color: '#4e79a7' },
    { label: 'FOUNDER', value: 'FOUNDER', color: '#f28e2b' },
    { label: 'COMPANY', value: 'COMPANY', color: '#e15759' },
    { label: 'INDIVIDUAL', value: 'INDIVIDUAL', color: '#76b7b2' },
    { label: 'CORPORATE', value: 'CORPORATE', color: '#59a14f' },
    { label: 'LTD LIABILITY', value: 'LIMITED LIABILITY', color: '#edc948' }
  ];

  return (
    <div className="client-group-container">
      <div className="client-group-header">
        <h5>
          <FontAwesomeIcon icon={faUsers} className="icon" />
          CLIENT GROUP
        </h5>
        <button 
          className={`refresh-btn ${isRefreshing ? 'refreshing' : ''}`}
          onClick={() => {
            refreshData();
          }}
          disabled={isRefreshing}
        >
          <FontAwesomeIcon 
            icon={isRefreshing ? faSpinner : faSyncAlt} 
            spin={isRefreshing} 
          />
        </button>
      </div>
      
      <div className="filter-grid">
        {clientGroups.map((group) => (
          <div 
            key={group.value}
            className={`filter-box ${activeFilter === group.value ? 'active' : ''}`}
            style={{
              backgroundColor: activeFilter === group.value ? group.color : 'white',
              color: activeFilter === group.value ? 'white' : '#212529'
            }}
            onClick={() => filterData(group.value)}
          >
            {group.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientGroup;