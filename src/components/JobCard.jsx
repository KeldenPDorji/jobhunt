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
      // Open the job application link
      window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Fallback: Search for the job on the company's career page
      const searchQuery = encodeURIComponent(`${job.title} ${job.company} careers`);
      const googleJobsUrl = `https://www.google.com/search?q=${searchQuery}&ibp=htl;jobs`;
      window.open(googleJobsUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    // Remove extra whitespace but keep paragraph breaks
    const cleaned = text.trim();
    if (cleaned.length <= maxLength) return cleaned;
    return cleaned.substring(0, maxLength).trim() + '...';
  };

  // Clean and format HTML from description - keep it simple and working
  const cleanDescription = (html) => {
    if (!html) return 'No description available';
    
    // Create a simple text version by removing HTML tags properly
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Get the text content
    let text = tempDiv.textContent || tempDiv.innerText || '';
    
    // Clean up whitespace
    text = text
      .replace(/\s+/g, ' ')  // Multiple spaces to single space
      .trim();
    
    return text;
  };

  const formatDescription = (text) => {
    if (!text || text.length < 20) return [];
    
    // Split into paragraphs at sentence boundaries
    // Look for periods followed by capital letters or double spaces
    const sentences = text.match(/[^.!?]+[.!?]+(?:\s+|$)/g) || [text];
    
    // Group sentences into paragraphs (3-4 sentences each)
    const sections = [];
    let currentParagraph = [];
    let charCount = 0;
    
    sentences.forEach((sentence, idx) => {
      const trimmed = sentence.trim();
      if (!trimmed) return;
      
      currentParagraph.push(trimmed);
      charCount += trimmed.length;
      
      // Create a new paragraph every 3-5 sentences or 400 characters
      if ((currentParagraph.length >= 3 && charCount > 300) || 
          charCount > 400 ||
          idx === sentences.length - 1) {
        
        if (currentParagraph.length > 0) {
          sections.push({
            title: null,
            content: [currentParagraph.join(' ')],
            isList: false
          });
        }
        
        currentParagraph = [];
        charCount = 0;
      }
    });
    
    return sections;
  };

  // Format bold text
  const formatBoldText = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const cleanedDescription = cleanDescription(job.description);
  const formattedSections = formatDescription(cleanedDescription);
  
  // Create preview text from all sections
  const previewText = formattedSections
    .map(section => {
      if (section.title) {
        return section.title + ' ' + section.content.join(' ');
      }
      return section.content.join(' ');
    })
    .join(' ');

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
        {!expanded ? (
          <>
            <p className="description-preview">
              {truncateText(previewText, 200)}
            </p>
            {previewText.length > 200 && (
              <button 
                onClick={() => setExpanded(!expanded)}
                className="expand-button"
              >
                Show More <ChevronDown size={16} />
              </button>
            )}
          </>
        ) : (
          <>
            <div className="description-full">
              {formattedSections.map((section, idx) => (
                <div key={idx} className="description-section">
                  {section.title && (
                    <h4 className="section-title">{formatBoldText(section.title)}</h4>
                  )}
                  {section.isList ? (
                    <ul className="description-list">
                      {section.content.map((item, itemIdx) => (
                        <li key={itemIdx}>{formatBoldText(item)}</li>
                      ))}
                    </ul>
                  ) : (
                    section.content.map((paragraph, pIdx) => (
                      <p key={pIdx} className="description-paragraph">
                        {formatBoldText(paragraph)}
                      </p>
                    ))
                  )}
                </div>
              ))}
            </div>
            <button 
              onClick={() => setExpanded(!expanded)}
              className="expand-button"
            >
              Show Less <ChevronUp size={16} />
            </button>
          </>
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
