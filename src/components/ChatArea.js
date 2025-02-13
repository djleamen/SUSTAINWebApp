import React from 'react';
import './ChatArea.css';

const ChatArea = ({ messages }) => {
  return (
    <div className="ChatArea">
      {messages.map((msg, index) => (
        <div key={index} className={`message-container ${msg.sender === 'You' ? 'user' : 'sustain'}`}>
          <div className={msg.sender === 'You' ? 'user-message' : 'sustain-message'}>
            <strong>{msg.sender}: </strong>{msg.text}
          </div>
          {/* ✅ Display token savings under SUSTAIN messages */}
          {msg.sender === 'SUSTAIN' && typeof msg.percentageSaved === 'number' && !isNaN(msg.percentageSaved) && (
          <div className="savings-text">
           Token savings: {msg.percentageSaved}%
          </div>
        )}
        </div>
      ))}
    </div>
  );
};

export default ChatArea;