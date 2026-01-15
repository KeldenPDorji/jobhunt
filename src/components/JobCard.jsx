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

  // Clean and format HTML from description
  const cleanDescription = (html) => {
    if (!html) return 'No description available';
    
    // Convert HTML to clean, well-formatted text
    let text = html
      // Handle headers - preserve them with special markers
      .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '\n\n###HEADER###$1###ENDHEADER###\n')
      // Handle paragraphs
      .replace(/<p[^>]*>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      // Handle line breaks
      .replace(/<br\s*\/?>/gi, '\n')
      // Handle lists - convert to bullets
      .replace(/<ul[^>]*>/gi, '\n')
      .replace(/<\/ul>/gi, '\n')
      .replace(/<ol[^>]*>/gi, '\n')
      .replace(/<\/ol>/gi, '\n')
      .replace(/<li[^>]*>/gi, '• ')
      .replace(/<\/li>/gi, '\n')
      // Handle strong/bold - keep emphasis
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
      // Remove all remaining HTML tags
      .replace(/<[^>]*>/g, '')
      // Handle HTML entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&rsquo;/g, "'")
      .replace(/&lsquo;/g, "'")
      .replace(/&rdquo;/g, '"')
      .replace(/&ldquo;/g, '"')
      // Clean up whitespace
      .replace(/\n\s*\n\s*\n+/g, '\n\n')  // Max 2 consecutive newlines
      .replace(/[ \t]+/g, ' ')              // Single spaces
      .replace(/^\s+|\s+$/gm, '')           // Trim each line
      .trim();
    
    return text;
  };

  const formatDescription = (text) => {
    if (!text) return [];
    
    // Common section headers to detect
    const sectionKeywords = [
      'responsibilities', 'requirements', 'qualifications', 'skills',
      'benefits', 'perks', 'what we offer', 'what you\'ll do', 
      'about the role', 'about you', 'required', 'preferred',
      'we are looking for', 'your profile', 'nice to have',
      'education', 'experience', 'technologies', 'tech stack'
    ];
    
    const lines = text.split('\n');
    const sections = [];
    let currentSection = { title: null, content: [], isList: false };
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Skip empty lines
      if (!trimmed) {
        if (currentSection.content.length > 0) {
          sections.push({ ...currentSection });
          currentSection = { title: null, content: [], isList: false };
        }
        return;
      }
      
      // Check if line is a marked header
      if (trimmed.includes('###HEADER###')) {
        if (currentSection.content.length > 0) {
          sections.push({ ...currentSection });
        }
        const headerText = trimmed.replace(/###HEADER###|###ENDHEADER###/g, '').trim();
        currentSection = { title: headerText, content: [], isList: false };
        return;
      }
      
      // Check if line looks like a section header
      const lowerLine = trimmed.toLowerCase();
      const isLikelyHeader = 
        sectionKeywords.some(keyword => lowerLine.startsWith(keyword)) &&
        trimmed.length < 60 &&
        (trimmed.endsWith(':') || trimmed.endsWith('?') || (index > 0 && !lines[index - 1].trim()));
      
      if (isLikelyHeader) {
        if (currentSection.content.length > 0) {
          sections.push({ ...currentSection });
        }
        currentSection = { 
          title: trimmed.replace(/:$/, ''), 
          content: [], 
          isList: false 
        };
        return;
      }
      
      // Check if line is a bullet point
      const isBullet = trimmed.startsWith('•') || 
                       trimmed.startsWith('-') || 
                       trimmed.startsWith('*') ||
                       /^\d+[\.)]\s/.test(trimmed);
      
      if (isBullet) {
        currentSection.isList = true;
        currentSection.content.push(trimmed.replace(/^[•\-*]\s*/, '').replace(/^\d+[\.)]\s*/, ''));
      } else {
        currentSection.content.push(trimmed);
      }
    });
    
    if (currentSection.content.length > 0) {
      sections.push(currentSection);
    }
    
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
