import React, { useState } from 'react';
import './InputArea.css';

const InputArea = ({ onSendMessage }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

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

export default InputArea;
