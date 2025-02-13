/*
  Description: This component renders the chat messages. It displays the sender and the message text.
*/

// Required imports
import React from 'react';
import './ChatArea.css';

// Display the chat messages
const ChatArea = ({ messages }) => {
  return (
    <div className="ChatArea">
      {messages.map((msg, index) => (
        <div key={index} className={`message-container ${msg.sender === 'You' ? 'user' : 'sustain'}`}>
          <div className={msg.sender === 'You' ? 'user-message' : 'sustain-message'}>
            <strong>{msg.sender}: </strong>{msg.text}
          </div>
          {/** Display the token savings if the sender is 'SUSTAIN' and the percentageSaved is a number */}
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

// Export the component
export default ChatArea;