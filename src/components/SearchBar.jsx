import React, { useState } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import './SearchBar.css';

function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query, location);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-group">
          <div className="input-wrapper">
            <Search size={20} className="input-icon" />
            <input
              type="text"
              placeholder="e.g. Software Engineer, DevOps, Data Scientist"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="input-wrapper">
            <MapPin size={20} className="input-icon" />
            <input
              type="text"
              placeholder="City, state, or remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="search-input"
            />
          </div>
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={20} className="spinner" />
                Searching...
              </>
            ) : (
              <>
                <Search size={20} />
                Search Jobs
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SearchBar;
