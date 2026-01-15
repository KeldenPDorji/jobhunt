import React from 'react';
import { Info, X } from 'lucide-react';
import './InfoBanner.css';

function InfoBanner({ onClose }) {
  return (
    <div className="info-banner">
      <div className="info-content">
        <Info size={20} />
        <div className="info-text">
          <strong>100% Real Jobs!</strong> Fetching live job listings from The Muse API. 
          <span className="info-link"> No mock data - all jobs are real and currently open.</span>
        </div>
      </div>
      <button onClick={onClose} className="info-close">
        <X size={18} />
      </button>
    </div>
  );
}

export default InfoBanner;
