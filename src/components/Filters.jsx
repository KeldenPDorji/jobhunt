import React from 'react';
import { Filter } from 'lucide-react';
import './Filters.css';

function Filters({ filters, onFilterChange }) {
  return (
    <aside className="filters">
      <div className="filters-header">
        <Filter size={20} />
        <h2>Filters</h2>
      </div>

      <div className="filter-section">
        <h3>Job Type</h3>
        <div className="filter-options">
          <label className="filter-option">
            <input
              type="radio"
              name="jobType"
              value="all"
              checked={filters.jobType === 'all'}
              onChange={(e) => onFilterChange('jobType', e.target.value)}
            />
            <span>All Types</span>
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="jobType"
              value="full-time"
              checked={filters.jobType === 'full-time'}
              onChange={(e) => onFilterChange('jobType', e.target.value)}
            />
            <span>Full-time</span>
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="jobType"
              value="part-time"
              checked={filters.jobType === 'part-time'}
              onChange={(e) => onFilterChange('jobType', e.target.value)}
            />
            <span>Part-time</span>
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="jobType"
              value="contract"
              checked={filters.jobType === 'contract'}
              onChange={(e) => onFilterChange('jobType', e.target.value)}
            />
            <span>Contract</span>
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="jobType"
              value="remote"
              checked={filters.jobType === 'remote'}
              onChange={(e) => onFilterChange('jobType', e.target.value)}
            />
            <span>Remote</span>
          </label>
        </div>
      </div>

      <div className="filter-section">
        <h3>Experience Level</h3>
        <div className="filter-options">
          <label className="filter-option">
            <input
              type="radio"
              name="experienceLevel"
              value="all"
              checked={filters.experienceLevel === 'all'}
              onChange={(e) => onFilterChange('experienceLevel', e.target.value)}
            />
            <span>All Levels</span>
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="experienceLevel"
              value="entry"
              checked={filters.experienceLevel === 'entry'}
              onChange={(e) => onFilterChange('experienceLevel', e.target.value)}
            />
            <span>Entry Level</span>
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="experienceLevel"
              value="mid"
              checked={filters.experienceLevel === 'mid'}
              onChange={(e) => onFilterChange('experienceLevel', e.target.value)}
            />
            <span>Mid-level</span>
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="experienceLevel"
              value="senior"
              checked={filters.experienceLevel === 'senior'}
              onChange={(e) => onFilterChange('experienceLevel', e.target.value)}
            />
            <span>Senior</span>
          </label>
        </div>
      </div>

      <div className="filter-section">
        <h3>Date Posted</h3>
        <div className="filter-options">
          <label className="filter-option">
            <input
              type="radio"
              name="datePosted"
              value="all"
              checked={filters.datePosted === 'all'}
              onChange={(e) => onFilterChange('datePosted', e.target.value)}
            />
            <span>Any Time</span>
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="datePosted"
              value="24h"
              checked={filters.datePosted === '24h'}
              onChange={(e) => onFilterChange('datePosted', e.target.value)}
            />
            <span>Last 24 hours</span>
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="datePosted"
              value="7d"
              checked={filters.datePosted === '7d'}
              onChange={(e) => onFilterChange('datePosted', e.target.value)}
            />
            <span>Last 7 days</span>
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="datePosted"
              value="30d"
              checked={filters.datePosted === '30d'}
              onChange={(e) => onFilterChange('datePosted', e.target.value)}
            />
            <span>Last 30 days</span>
          </label>
        </div>
      </div>
    </aside>
  );
}

export default Filters;
