/*
Description: This file contains the InputArea component, which is a 
simple input field and a button to send the message.
*/

// Required imports
import React, { useState } from 'react';
import './InputArea.css';

// InputArea component
const InputArea = ({ onSendMessage }) => {
  const [input, setInput] = useState('');

  // Function to handle the input change
  const handleChange = (e) => {
    setInput(e.target.value);
  };

  // Function to handle the text submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  // Return the input area
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

export default InputArea;