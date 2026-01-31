/**
 * TokenSavings Component
 * 
 * This component displays the average token savings achieved by users,
 * encouraging environmentally friendly usage of AI services.
 * 
 * Author: SUSTAIN Development Team
 * Last Modified: Jan 2026
 */

import PropTypes from 'prop-types';
import './TokenSavings.css';

const TokenSavings = ({ averageSavings }) => {
  /**
   * TokenSavings component to display average token savings.
   * 
   * @param {string|number} averageSavings - The average token savings percentage.
   * @returns {JSX.Element} The rendered TokenSavings component.
   */
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
