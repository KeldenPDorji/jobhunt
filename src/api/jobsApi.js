import axios from 'axios';

// Using The Muse API - Completely FREE, no API key needed!
// Fallback to other APIs if needed

// Helper function to clean HTML from descriptions
const cleanHTMLDescription = (html) => {
  if (!html) return '';
  
  // Create a temporary div to parse HTML
  const doc = new DOMParser().parseFromString(html, 'text/html');
  
  // Get text content
  let text = doc.body.textContent || '';
  
  // Remove common boilerplate sections that aren't part of the actual job description
  const boilerplatePatterns = [
    // Application instructions
    /To get the best candidate experience.*?within 12 months.*?\./gi,
    /Please.*?apply.*?maximum.*?roles.*?\./gi,
    
    // Legal and compliance sections
    /Posting Statement[\s\S]*?(?=\n\n[A-Z]|$)/gi,
    /Equal Opportunity Employer[\s\S]*?(?=\n\n[A-Z]|$)/gi,
    /Salesforce is an equal opportunity employer[\s\S]*?(?=\n\n[A-Z]|$)/gi,
    /maintains a policy of non-discrimination[\s\S]*?(?=\n\n[A-Z]|$)/gi,
    /Know your rights:[\s\S]*?(?=\n\n[A-Z]|$)/gi,
    /workplace discrimination is illegal[\s\S]*?(?=\n\n[A-Z]|$)/gi,
    /Any employee or potential employee[\s\S]*?(?=\n\n[A-Z]|$)/gi,
    /This policy applies to[\s\S]*?(?=\n\n[A-Z]|$)/gi,
    /Recruiting, hiring, and promotion decisions[\s\S]*?(?=\n\n[A-Z]|$)/gi,
    
    // Accommodations
    /Accommodations[\s\S]*?Accommodations Request Form[\s\S]*?\./gi,
    /If you require assistance due to a disability[\s\S]*?\./gi,
    
    // Salary and benefits disclaimers (keep the ranges but remove verbose legal text)
    /In the United States, compensation offered will be determined[\s\S]*?following link:[^\n]*/gi,
    /Pursuant to the San Francisco Fair Chance[\s\S]*?conviction records\./gi,
    /More details about.*?benefits.*?can be found at.*?\./gi,
    
    // Generic application prompts
    /IN SCHOOL OR GRADUATED[\s\S]*?OPPORTUNITIES/gi,
    /Note: By applying to this posting[\s\S]*?(?=\n\n|$)/gi,
    
    // Noise at the beginning
    /^Job Category[\s\S]*?Job Details/gi,
    
    // Generic company descriptions at the end
    /At \w+, we believe in[\s\S]*?(?=\n\n[A-Z]|$)/gi,
    /Check out our.*?site.*?\./gi,
    
    // "Unleash your potential" type marketing fluff
    /Unleash Your Potential[\s\S]*?(?=\n\n[A-Z]|$)/gi,
    /When you join.*?you'll be limitless[\s\S]*?(?=\n\n[A-Z]|$)/gi,
    
    // Remove duplicate/redundant equal opportunity statements
    /\.\.\.\s*Salesforce is an equal[\s\S]*$/gi,
  ];
  
  // Apply all boilerplate removal patterns
  boilerplatePatterns.forEach(pattern => {
    text = text.replace(pattern, '');
  });
  
  // Clean up extra whitespace and newlines
  text = text
    .replace(/\n\s*\n\s*\n+/g, '\n\n') // Multiple newlines to double newline
    .replace(/[ \t]+/g, ' ') // Multiple spaces to single space
    .replace(/^\s+|\s+$/gm, '') // Trim each line
    .trim();
  
  // Try to extract just the core job description sections
  // Look for the main content between the header and the legal footer
  const sections = text.split(/\n\n+/);
  const relevantSections = sections.filter(section => {
    const lower = section.toLowerCase();
    
    // Skip sections that are clearly boilerplate
    if (lower.includes('equal opportunity') ||
        lower.includes('posting statement') ||
        lower.includes('workplace discrimination') ||
        lower.includes('accommodations request') ||
        lower.includes('fair chance ordinance') ||
        lower.includes('check out our') ||
        lower.includes('for roles in san francisco') ||
        lower.includes('typical base salary range') && lower.length > 300) {
      return false;
    }
    
    // Keep sections that look like actual job content
    return section.length > 20;
  });
  
  text = relevantSections.join('\n\n');
  
  // Limit total length to avoid overwhelming descriptions (keep about 2000 chars)
  if (text.length > 2500) {
    text = text.substring(0, 2500).trim();
    // Try to end at a sentence
    const lastPeriod = text.lastIndexOf('.');
    const lastNewline = text.lastIndexOf('\n');
    const cutoff = Math.max(lastPeriod, lastNewline);
    if (cutoff > 2000) {
      text = text.substring(0, cutoff + 1);
    }
  }
  
  return text;
};

export const fetchJobs = async (query = 'software engineer', location = '') => {
  try {
    // PRIMARY: The Muse API - No API key required!
    // Focus on Tech & IT jobs only
    console.log('🔍 Fetching real tech jobs from The Muse API...');
    try {
      const museResponse = await axios.get('https://www.themuse.com/api/public/jobs', {
        params: {
          page: 0,
          descending: true,
          category: 'Software Engineering', // Filter for tech jobs
          ...(query && { search: query }),
          ...(location && { location: location })
        }
      });

      if (museResponse.data && museResponse.data.results && museResponse.data.results.length > 0) {
        console.log(`✅ SUCCESS! Fetched ${museResponse.data.results.length} REAL jobs from The Muse API`);
        return museResponse.data.results.map(job => {
          // Try to extract a cleaner description
          // The Muse API provides 'contents' which has the full posting
          let description = '';
          
          // First try to use the description field if available
          if (job.description) {
            description = cleanHTMLDescription(job.description);
          } else if (job.contents) {
            // Fall back to contents but clean it heavily
            description = cleanHTMLDescription(job.contents);
          }
          
          // If description is still too short or empty, provide a fallback
          if (!description || description.length < 50) {
            description = 'No detailed description available. Click "Apply Now" to view the complete job posting.';
          }
          
          return {
            id: job.id,
            title: job.name,
            company: job.company.name,
            location: job.locations?.map(loc => loc.name).join(', ') || 'Remote',
            description: description,
            type: job.type || 'Full-time',
            salary: 'Not specified',
            datePosted: job.publication_date,
            applyUrl: job.refs?.landing_page || '#',
            logo: job.company.refs?.logo || null,
            level: job.levels?.map(l => l.name).join(', ') || 'Not specified',
            schedule: job.locations?.some(loc => loc.name.toLowerCase().includes('remote')) ? 'Remote' : 'On-site',
            category: job.categories?.map(c => c.name).join(', ')
          };
        });
      }
    } catch (museError) {
      console.warn('⚠️ The Muse API failed:', museError.message);
      console.log('Trying fallback APIs...');
    }

    // FALLBACK: Try JSearch API if you have a key
    // Use environment variable for security - never hardcode API keys!
    const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
    if (RAPIDAPI_KEY && RAPIDAPI_KEY !== 'YOUR_RAPIDAPI_KEY' && RAPIDAPI_KEY !== '') {
      console.log('🔍 Trying JSearch API...');
      // Using JSearch API from RapidAPI
      const response = await axios.get('https://jsearch.p.rapidapi.com/search', {
        params: {
          query: `${query}${location ? ' in ' + location : ''}`,
          page: '1',
          num_pages: '1',
          date_posted: 'all'
        },
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        }
      });

      if (response.data && response.data.data && response.data.data.length > 0) {
        console.log(`✅ SUCCESS! Fetched ${response.data.data.length} REAL jobs from JSearch API`);
        return response.data.data.map(job => ({
          id: job.job_id,
          title: job.job_title,
          company: job.employer_name,
          location: job.job_city && job.job_country ? `${job.job_city}, ${job.job_country}` : job.job_country || 'Remote',
          description: cleanHTMLDescription(job.job_description) || 'No description available',
          type: job.job_employment_type || 'Full-time',
          salary: job.job_salary || 'Not specified',
          datePosted: job.job_posted_at_datetime_utc,
          applyUrl: job.job_apply_link,
          logo: job.employer_logo,
          level: job.job_required_experience?.required_experience_in_months 
            ? (job.job_required_experience.required_experience_in_months > 60 ? 'Senior' : 'Mid-level')
            : 'Entry Level',
          highlights: job.job_highlights,
          schedule: job.job_is_remote ? 'Remote' : 'On-site'
        }));
      }
    }

    // FALLBACK 2: Try Adzuna API if you have keys
    // Use environment variables for security - never hardcode API keys!
    const ADZUNA_APP_ID = import.meta.env.VITE_ADZUNA_APP_ID;
    const ADZUNA_APP_KEY = import.meta.env.VITE_ADZUNA_APP_KEY;
    
    if (ADZUNA_APP_ID && ADZUNA_APP_ID !== 'YOUR_APP_ID' && ADZUNA_APP_KEY && ADZUNA_APP_KEY !== 'YOUR_APP_KEY') {
      console.log('🔍 Trying Adzuna API...');
      const country = 'us';
      const adzunaResponse = await axios.get(
        `https://api.adzuna.com/v1/api/jobs/${country}/search/1`,
        {
          params: {
            app_id: ADZUNA_APP_ID,
            app_key: ADZUNA_APP_KEY,
            results_per_page: 20,
            what: query,
            where: location,
            'content-type': 'application/json'
          }
        }
      );

      if (adzunaResponse.data && adzunaResponse.data.results && adzunaResponse.data.results.length > 0) {
        console.log(`✅ SUCCESS! Fetched ${adzunaResponse.data.results.length} REAL jobs from Adzuna API`);
        return adzunaResponse.data.results.map(job => ({
          id: job.id,
          title: job.title,
          company: job.company.display_name,
          location: job.location.display_name,
          description: cleanHTMLDescription(job.description),
          type: job.contract_time || 'Full-time',
          salary: job.salary_min && job.salary_max 
            ? `$${Math.round(job.salary_min / 1000)}k - $${Math.round(job.salary_max / 1000)}k`
            : 'Not specified',
          datePosted: job.created,
          applyUrl: job.redirect_url,
          category: job.category.label,
          level: 'Not specified'
        }));
      }
    }

    // If all APIs fail, throw error - DO NOT return mock data
    throw new Error('All job APIs are currently unavailable. Please check your internet connection or try again later.');
  } catch (error) {
    console.error('❌ ERROR: Failed to fetch real jobs:', error.message);
    throw error; // Propagate error instead of returning mock data
  }
};
