import React from 'react';
import './TokenSavings.css';

const TokenSavings = ({ averageSavings }) => {
  return (
    <div className="TokenSavings" style={{ fontFamily: 'Lexend, sans-serif', fontWeight: 'normal' }}>
      Average token savings: {averageSavings}%. Thank you for going green!
    </div>
  );
};

export default TokenSavings;
