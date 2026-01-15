import React from 'react';
import JobCard from './JobCard';
import { Loader2, Briefcase } from 'lucide-react';
import './JobList.css';

function JobList({ jobs, loading, error }) {
  if (loading) {
    return (
      <div className="loading-container">
        <Loader2 size={48} className="spinner" />
        <p>Loading amazing opportunities...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="empty-container">
        <Briefcase size={64} />
        <h3>No jobs found</h3>
        <p>Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="job-list">
      <div className="job-list-header">
        <h2>{jobs.length} Jobs Found</h2>
      </div>
      <div className="job-cards">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}

export default JobList;
