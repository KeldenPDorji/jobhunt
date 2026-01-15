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

// REMOVED: Mock data - This app only shows REAL jobs!
// If you see this error, it means the API is not working.
// Check console for error messages and verify your internet connection.

/* MOCK DATA REMOVED - REAL JOBS ONLY
const getMockJobs = (query, location) => {
  const allJobs = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      description: 'We are looking for an experienced Frontend Developer to join our team. You will be responsible for building modern web applications using React, TypeScript, and modern CSS frameworks.',
      type: 'Full-time',
      salary: '$120k - $180k',
      datePosted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      applyUrl: '#',
      level: 'Senior',
      schedule: 'Remote'
    },
    {
      id: '2',
      title: 'Full Stack Engineer',
      company: 'Startup Inc',
      location: 'New York, NY',
      description: 'Join our dynamic startup as a Full Stack Engineer. Work with Node.js, React, and cloud technologies to build scalable applications.',
      type: 'Full-time',
      salary: '$100k - $150k',
      datePosted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      applyUrl: '#',
      level: 'Mid-level',
      schedule: 'Hybrid'
    },
    {
      id: '3',
      title: 'Junior Software Developer',
      company: 'Innovation Labs',
      location: 'Austin, TX',
      description: 'Great opportunity for recent graduates or junior developers. Work on exciting projects with mentorship from senior developers.',
      type: 'Full-time',
      salary: '$70k - $90k',
      datePosted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      applyUrl: '#',
      level: 'Entry Level',
      schedule: 'On-site'
    },
    {
      id: '4',
      title: 'DevOps Engineer',
      company: 'Cloud Solutions',
      location: 'Remote',
      description: 'Seeking a skilled DevOps Engineer to manage our cloud infrastructure, CI/CD pipelines, and automation tools.',
      type: 'Full-time',
      salary: '$110k - $160k',
      datePosted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      applyUrl: '#',
      level: 'Mid-level',
      schedule: 'Remote'
    },
    {
      id: '5',
      title: 'UI/UX Designer',
      company: 'Design Studio',
      location: 'Los Angeles, CA',
      description: 'Creative UI/UX Designer needed to design beautiful and intuitive user interfaces for web and mobile applications.',
      type: 'Contract',
      salary: '$80k - $120k',
      datePosted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      applyUrl: '#',
      level: 'Mid-level',
      schedule: 'Hybrid'
    },
    {
      id: '6',
      title: 'Backend Developer - Python',
      company: 'Data Corp',
      location: 'Seattle, WA',
      description: 'Looking for a Backend Developer with strong Python skills. Work on APIs, databases, and microservices architecture.',
      type: 'Full-time',
      salary: '$95k - $140k',
      datePosted: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      applyUrl: '#',
      level: 'Mid-level',
      schedule: 'Remote'
    },
    {
      id: '7',
      title: 'Mobile Developer - React Native',
      company: 'App Masters',
      location: 'Boston, MA',
      description: 'Join our mobile team to build cross-platform applications using React Native for iOS and Android.',
      type: 'Full-time',
      salary: '$100k - $145k',
      datePosted: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      applyUrl: '#',
      level: 'Mid-level',
      schedule: 'Hybrid'
    },
    {
      id: '8',
      title: 'Data Engineer',
      company: 'Analytics Inc',
      location: 'Remote',
      description: 'Build and maintain data pipelines, work with big data technologies like Spark, Kafka, and cloud platforms.',
      type: 'Full-time',
      salary: '$115k - $165k',
      datePosted: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      applyUrl: '#',
      level: 'Senior',
      schedule: 'Remote'
    },
    {
      id: '9',
      title: 'QA Automation Engineer',
      company: 'Quality First',
      location: 'Denver, CO',
      description: 'Develop automated test frameworks and ensure product quality through comprehensive testing strategies.',
      type: 'Full-time',
      salary: '$85k - $120k',
      datePosted: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      applyUrl: '#',
      level: 'Mid-level',
      schedule: 'On-site'
    },
    {
      id: '10',
      title: 'Product Manager',
      company: 'Product Co',
      location: 'San Francisco, CA',
      description: 'Lead product strategy and roadmap. Work with engineering, design, and business teams to deliver great products.',
      type: 'Full-time',
      salary: '$130k - $190k',
      datePosted: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      applyUrl: '#',
      level: 'Senior',
      schedule: 'Hybrid'
    }
  ];

  // Filter by query if provided
  let filtered = allJobs;
  if (query && query !== 'software developer') {
    filtered = allJobs.filter(job => 
      job.title.toLowerCase().includes(query.toLowerCase()) ||
      job.company.toLowerCase().includes(query.toLowerCase()) ||
      job.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Filter by location if provided
  if (location) {
    filtered = filtered.filter(job =>
      job.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  return filtered.length > 0 ? filtered : allJobs;
};
*/
