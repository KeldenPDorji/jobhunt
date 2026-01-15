import React from 'react';
import { Info, X } from 'lucide-react';
import './InfoBanner.css';

function InfoBanner({ onClose }) {
  return (
    <div className="info-banner">
      <div className="info-content">
        <Info size={20} />
        <div className="info-text">
          <strong>Tech Jobs Only!</strong> Search thousands of real tech & IT positions. 
          <span className="info-link"> Software, DevOps, Data, Cloud & more.</span>
        </div>
      </div>
      <button onClick={onClose} className="info-close">
        <X size={18} />
      </button>
    </div>
  );
}

export default InfoBanner;
