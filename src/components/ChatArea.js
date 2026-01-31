/**
 * ChatArea.js
 * 
 * This component displays the chat area where user and SUSTAIN messages are shown.
 * It handles rendering messages, including system messages and token savings information.
 * The chat area automatically scrolls to the latest message when new messages are added.
 * 
 * Author: SUSTAIN Development Team
 * Last Modified: Jan 2026
 */

import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './ChatArea.css';

const ChatArea = ({ messages }) => {
  /**
   * ChatArea component to display chat messages.
   * 
   * @param {Array} messages - Array of message objects with sender, text, and optional percentageSaved.
   * @returns {JSX.Element} The rendered chat area component.
   */
  const chatEndRef = useRef(null);

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    /**
     * Scrolls the chat area to the latest message.
     */
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="ChatArea">
      {messages.map((msg, index) => (
        /**
         * Renders individual chat messages.
         * 
         * @param {Object} msg - The message object.
         * @param {number} index - The index of the message in the array.
         * @returns {JSX.Element} The rendered message element.
         */
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
