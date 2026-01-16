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
  
  // Clean up extra whitespace and newlines
  text = text
    .replace(/\n\s*\n\s*\n/g, '\n\n') // Multiple newlines to double newline
    .replace(/[ \t]+/g, ' ') // Multiple spaces to single space
    .trim();
  
  // Limit length for preview (full text available on expand)
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
        return museResponse.data.results.map(job => ({
          id: job.id,
          title: job.name,
          company: job.company.name,
          location: job.locations?.map(loc => loc.name).join(', ') || 'Remote',
          description: cleanHTMLDescription(job.contents) || 'No description available',
          type: job.type || 'Full-time',
          salary: 'Not specified',
          datePosted: job.publication_date,
          applyUrl: job.refs?.landing_page || '#',
          logo: job.company.refs?.logo || null,
          level: job.levels?.map(l => l.name).join(', ') || 'Not specified',
          schedule: job.locations?.some(loc => loc.name.toLowerCase().includes('remote')) ? 'Remote' : 'On-site',
          category: job.categories?.map(c => c.name).join(', ')
        }));
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
