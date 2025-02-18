/*
Description: This component displays the average token savings percentage.
*/

// Required imports
import React from 'react';
import './TokenSavings.css';

// Display the average token savings
const TokenSavings = ({ averageSavings }) => {
  return (
    <div className="TokenSavings" style={{ fontFamily: 'Lexend, sans-serif', fontWeight: 'normal' }}>
      Average token savings: {averageSavings}%. Thank you for going green!
    </div>
  );
};

// Export the component
export default TokenSavings;