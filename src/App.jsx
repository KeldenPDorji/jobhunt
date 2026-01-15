import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import Filters from './components/Filters';
import JobList from './components/JobList';
import InfoBanner from './components/InfoBanner';
import { fetchJobs } from './api/jobsApi';
import './App.css';

function App() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showBanner, setShowBanner] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [filters, setFilters] = useState({
    jobType: 'all',
    experienceLevel: 'all',
    datePosted: 'all'
  });

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [jobs, searchQuery, locationQuery, filters]);

  const loadJobs = async (query = 'software developer', location = '') => {
    setLoading(true);
    setError(null);
    setShowBanner(true);
    try {
      const data = await fetchJobs(query, location);
      if (data && data.length > 0) {
        setJobs(data);
        setFilteredJobs(data);
        console.log(`✅ Loaded ${data.length} real jobs successfully!`);
      } else {
        setError('No jobs found for your search. Try different keywords or location.');
        setJobs([]);
        setFilteredJobs([]);
      }
    } catch (err) {
      setError('Unable to fetch real jobs. Please check your internet connection and try again.');
      console.error('Job fetch error:', err);
      setJobs([]);
      setFilteredJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query, location) => {
    setSearchQuery(query);
    setLocationQuery(location);
    loadJobs(query || 'software developer', location);
  };

  const applyFilters = () => {
    let filtered = [...jobs];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply location filter
    if (locationQuery) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(locationQuery.toLowerCase())
      );
    }

    // Apply job type filter
    if (filters.jobType !== 'all') {
      filtered = filtered.filter(job => {
        const jobTypeMatch = job.type?.toLowerCase() === filters.jobType.toLowerCase() ||
                            job.schedule?.toLowerCase() === filters.jobType.toLowerCase();
        return jobTypeMatch;
      });
    }

    // Apply experience level filter
    if (filters.experienceLevel !== 'all') {
      filtered = filtered.filter(job => {
        const level = job.level?.toLowerCase() || '';
        return level.includes(filters.experienceLevel.toLowerCase());
      });
    }

    // Apply date posted filter
    if (filters.datePosted !== 'all') {
      const now = new Date();
      filtered = filtered.filter(job => {
        if (!job.datePosted) return true;
        const postedDate = new Date(job.datePosted);
        const diffDays = (now - postedDate) / (1000 * 60 * 60 * 24);
        
        switch (filters.datePosted) {
          case '24h':
            return diffDays <= 1;
          case '7d':
            return diffDays <= 7;
          case '30d':
            return diffDays <= 30;
          default:
            return true;
        }
      });
    }

    setFilteredJobs(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="container">
          {showBanner && <InfoBanner onClose={() => setShowBanner(false)} />}
          <SearchBar onSearch={handleSearch} loading={loading} />
          <div className="content-wrapper">
            <Filters 
              filters={filters} 
              onFilterChange={handleFilterChange}
            />
            <JobList 
              jobs={filteredJobs} 
              loading={loading} 
              error={error}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
