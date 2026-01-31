/**
 * InfoModal.js
 * 
 * This component displays an informational modal dialog for the SUSTAIN web application.
 * It provides users with instructions on how to use the chat, FAQs, and details about
 * the ethics policy and text optimizations performed by SUSTAIN.
 * 
 * Author: SUSTAIN Development Team
 * Last Modified: Jan 2026
 */

import PropTypes from 'prop-types';
import './InfoModal.css';

const InfoModal = ({ onClose, darkMode }) => {
  /**
   * InfoModal component to display information about the SUSTAIN app.
   * 
   * @param {Function} onClose - Function to call when the modal is closed.
   * @param {boolean} darkMode - Flag indicating if dark mode is enabled.
   * @returns {JSX.Element} The rendered InfoModal component.
   */
  const handleClickOutside = (e) => {
    /**
     * Handles clicks outside the modal content to close the modal.
     * 
     * @param {Object} e - The click event object.
     */
    if (e.target.className === 'InfoModal') {
      onClose();
    }
  };

  const handleKeyDown = (event) => {
    /**
     * Handles keydown events to close the modal on Escape key press.
     * 
     * @param {Object} event - The keyboard event object.
     */
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
      open
      aria-labelledby="info-header"
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
