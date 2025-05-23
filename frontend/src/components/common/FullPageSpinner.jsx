<<<<<<< HEAD
// filepath: c:\Users\fosam\OneDrive\Desktop\Uni\Semester 4\Software Engineering\SE-Project-1\frontend\src\components\common\FullPageSpinner.jsx
=======
>>>>>>> main
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