/*
  Description: This component renders the chat messages. It displays the sender and the message text.
*/

// Required imports
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './ChatArea.css';

// Display the chat messages
const ChatArea = ({ messages }) => {
  const chatEndRef = useRef(null);

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="ChatArea">
      {messages.map((msg, index) => (
        <div key={`${msg.sender}-${msg.text.slice(0, 20)}-${index}`} className={`message-container ${msg.sender === 'You' ? 'user' : 'sustain'}`}>
          {msg.system ? (
            <div className="system-message">{msg.text}</div>
          ) : (
            <>
              <div className={msg.sender === 'You' ? 'user-message' : 'sustain-message'}>
                <strong>{msg.sender}: </strong>{msg.text}
              </div>
              {/** Display the token savings if the sender is 'SUSTAIN' and the percentageSaved is a number */}
              {msg.sender === 'SUSTAIN' && typeof msg.percentageSaved === 'number' && !Number.isNaN(msg.percentageSaved) && (
                <div className="savings-text">
                  Token savings: {msg.percentageSaved}%
                </div>
              )}
            </>
          )}
        </div>
      ))}
      <div ref={chatEndRef} />
    </div>
  );
};

// PropTypes validation
ChatArea.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    sender: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    percentageSaved: PropTypes.number,
    system: PropTypes.bool
  })).isRequired
};

// Export the component
export default ChatArea;