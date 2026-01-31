/**
 * InputArea.js
 * 
 * This component provides an input area for users to type and send messages
 * to the SUSTAIN AI. It includes a text input field and a send button.
 * 
 * Author: SUSTAIN Development Team
 * Last Modified: Jan 2026
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import './InputArea.css';

const InputArea = ({ onSendMessage }) => {
  /**
   * InputArea component for user message input.
   * 
   * @param {Function} onSendMessage - Function to call when a message is sent.
   * @returns {JSX.Element} The rendered InputArea component.
   */
  const [input, setInput] = useState('');

  const handleChange = (e) => {
    /**
     * Handles changes to the input field.
     * 
     * @param {Object} e - The change event object.
     */
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    /**
     * Handles form submission to send the message.
     * 
     * @param {Object} e - The submit event object.
     */
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <form className="InputArea" onSubmit={handleSubmit}>
      <input
        type="text"
        value={input}
        onChange={handleChange}
        placeholder="Type your message here..."
      />
      <button type="submit">Send</button>
    </form>
  );
};

// PropTypes validation
InputArea.propTypes = {
  onSendMessage: PropTypes.func.isRequired
};

export default InputArea;
