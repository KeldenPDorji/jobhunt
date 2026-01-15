import React, { useState } from 'react';
import { MapPin, Briefcase, DollarSign, Clock, ExternalLink, Building2, ChevronDown, ChevronUp } from 'lucide-react';
import './JobCard.css';

function JobCard({ job }) {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently posted';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const handleApply = () => {
    if (job.applyUrl && job.applyUrl !== '#') {
      window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert('Apply functionality: This would redirect to the job application page');
    }
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div className="job-company-info">
          {job.logo && (
            <img src={job.logo} alt={job.company} className="company-logo" />
          )}
          {!job.logo && (
            <div className="company-logo-placeholder">
              <Building2 size={24} />
            </div>
          )}
          <div>
            <h3 className="job-title">{job.title}</h3>
            <p className="job-company">{job.company}</p>
          </div>
        </div>
        <button onClick={handleApply} className="apply-button">
          Apply Now
          <ExternalLink size={16} />
        </button>
      </div>

      <div className="job-meta">
        <div className="meta-item">
          <MapPin size={16} />
          <span>{job.location}</span>
        </div>
        <div className="meta-item">
          <Briefcase size={16} />
          <span>{job.type}</span>
        </div>
        {job.salary && (
          <div className="meta-item">
            <DollarSign size={16} />
            <span>{job.salary}</span>
          </div>
        )}
        <div className="meta-item">
          <Clock size={16} />
          <span>{formatDate(job.datePosted)}</span>
        </div>
      </div>

      {job.level && (
        <div className="job-badges">
          <span className="badge">{job.level}</span>
          {job.schedule && <span className="badge">{job.schedule}</span>}
        </div>
      )}

      <div className="job-description">
        <p>
          {expanded 
            ? job.description 
            : truncateText(job.description, 200)
          }
        </p>
        {job.description && job.description.length > 200 && (
          <button 
            onClick={() => setExpanded(!expanded)}
            className="expand-button"
          >
            {expanded ? (
              <>
                Show Less <ChevronUp size={16} />
              </>
            ) : (
              <>
                Show More <ChevronDown size={16} />
              </>
            )}
          </button>
        )}
      </div>

      {expanded && job.highlights && (
        <div className="job-highlights">
          {job.highlights.Qualifications && (
            <div className="highlight-section">
              <h4>Qualifications:</h4>
              <ul>
                {job.highlights.Qualifications.slice(0, 3).map((qual, idx) => (
                  <li key={idx}>{qual}</li>
                ))}
              </ul>
            </div>
          )}
          {job.highlights.Responsibilities && (
            <div className="highlight-section">
              <h4>Responsibilities:</h4>
              <ul>
                {job.highlights.Responsibilities.slice(0, 3).map((resp, idx) => (
                  <li key={idx}>{resp}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default JobCard;
