/*
Description: This component displays the average token savings percentage.
*/

// Required imports
import React from 'react';
import PropTypes from 'prop-types';
import './TokenSavings.css';

// Display the average token savings
const TokenSavings = ({ averageSavings }) => {
  return (
    <div className="TokenSavings" style={{ fontFamily: 'Lexend, sans-serif', fontWeight: 'normal' }}>
      Average token savings: {averageSavings}%. Thank you for going green!
    </div>
  );
};

// PropTypes validation
TokenSavings.propTypes = {
  averageSavings: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired
};

// Export the component
export default TokenSavings;