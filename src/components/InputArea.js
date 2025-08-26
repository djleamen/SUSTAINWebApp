/*
Description: This file contains the InputArea component, which is a 
simple input field and a button to send the message.
*/

// Required imports
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './InputArea.css';

const InputArea = ({ onSendMessage }) => {
  const [input, setInput] = useState('');

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
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