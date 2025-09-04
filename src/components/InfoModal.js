/*
  Description: This component renders the information modal. 
  It displays information about the application and how to use it.
*/

// Required imports
import React from 'react';
import PropTypes from 'prop-types';
import './InfoModal.css';

// Display the information modal
const InfoModal = ({ onClose, darkMode }) => {
  const handleClickOutside = (e) => {
    if (e.target.className === 'InfoModal') {
      onClose();
    }
  };

  // Handle keyboard events for accessibility
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  // Return the JSX for the component
  return (
    <dialog 
      className="InfoModal" 
      onClick={handleClickOutside}
      onKeyDown={handleKeyDown}
      aria-modal="true"
      aria-labelledby="info-header"
      tabIndex={-1}
    >
      <div className={`InfoModal-content ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <h2 id="info-header"><strong>Information</strong></h2>
        <p>Welcome to SUSTAIN Chat!</p>
        <p><strong>How to use:</strong></p>
        <ul>
          <li>Type your message in the text box at the bottom of the window.</li>
          <li>Press Enter to send your message to SUSTAIN.</li>
          <li>SUSTAIN will respond with an optimized message.</li>
        </ul>
        <h3>FAQs:</h3>
        <p><strong>What is a token?</strong></p>
        <p>A token is a unit of text that the AI processes. Tokens can be as short as one character or as long as one word.</p>
        <p><strong>Ethics Policy:</strong></p>
        <p>We follow OpenAI's ethics policy, ensuring that our AI is used responsibly and ethically. We prioritize user privacy and data security.</p>
        <p><strong>What we cut out and why:</strong></p>
        <p>We remove unnecessary words and phrases to optimize the text and reduce the number of tokens used. This helps in reducing compute costs and environmental impact.</p>
      </div>
    </dialog>
  );
};

// PropTypes validation
InfoModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired
};

// Export the component
export default InfoModal;