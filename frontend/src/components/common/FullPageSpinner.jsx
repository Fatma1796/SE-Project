import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import './LoadingSpinner.css';

const FullPageSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="spinner-overlay">
      <LoadingSpinner size="large" text={text} />
    </div>
  );
};

export default FullPageSpinner;