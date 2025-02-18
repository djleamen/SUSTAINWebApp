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

  // Handle sending the message
  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  // Return the JSX for the component
  return (
    <div className="InputArea" style={{ fontFamily: 'Lexend, sans-serif', fontWeight: 'normal' }}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Type your message..."
        style={{ fontFamily: 'Lexend, sans-serif', fontWeight: 'normal' }}
      />
      <button onClick={handleSend} style={{ fontFamily: 'Lexend, sans-serif', fontWeight: 'normal' }}>Send</button>
    </div>
  );
};

// Export the component
export default InputArea;