import React from 'react';
import './InfoModal.css';

const InfoModal = ({ onClose }) => {
  return (
    <div className="InfoModal">
      <div className="InfoModal-content">
        <h2>Information</h2>
        <p>Welcome to SUSTAIN Chat!</p>
        <p>How to use:</p>
        <ul>
          <li>Type your message in the text box at the bottom of the window.</li>
          <li>Press Enter to send your message to SUSTAIN.</li>
          <li>SUSTAIN will respond with an optimized message.</li>
        </ul>
        <p>FAQs:</p>
        <p><strong>What is a token?</strong></p>
        <p>A token is a unit of text that the AI processes. Tokens can be as short as one character or as long as one word.</p>
        <p><strong>Ethics Policy:</strong></p>
        <p>We follow OpenAI's ethics policy, ensuring that our AI is used responsibly and ethically. We prioritize user privacy and data security.</p>
        <p><strong>What we cut out and why:</strong></p>
        <p>We remove unnecessary words and phrases to optimize the text and reduce the number of tokens used. This helps in reducing compute costs and environmental impact.</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default InfoModal;
