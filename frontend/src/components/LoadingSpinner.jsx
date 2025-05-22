import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'primary', text = 'Loading...' }) => {
  const spinnerSizes = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-grow-lg'
  };

  return (
    <div className="d-flex align-items-center justify-content-center">
      <div className={`spinner-border text-${color} ${spinnerSizes[size]}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      {text && <span className="ms-2">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;