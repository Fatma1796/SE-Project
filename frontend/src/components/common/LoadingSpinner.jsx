import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClass = {
    small: 'spinner-sm',
    medium: 'spinner-md',
    large: 'spinner-lg'
  }[size] || 'spinner-md';
  
  return (
    <div className="spinner-container">
      <div className={`spinner ${sizeClass}`}></div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;