import React from 'react';
import { Briefcase } from 'lucide-react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Briefcase size={32} />
            <h1>RealJob</h1>
          </div>
          <p className="tagline">Find Your Dream Tech Job Today</p>
        </div>
      </div>
    </header>
  );
}

export default Header;
