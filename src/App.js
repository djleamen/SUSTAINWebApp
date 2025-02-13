/*
Description: This is the main component of the application. It contains the chat area, 
input area, token savings, info modal, and settings modal components. It also contains 
the logic for sending messages to the SUSTAIN API and updating the chat area with the 
response. The average savings per message is calculated and displayed in the token savings 
component. The info modal and settings modal can be opened by clicking on the respective 
buttons in the header.
*/

// Required imports
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ChatArea from './components/ChatArea';
import InputArea from './components/InputArea';
import TokenSavings from './components/TokenSavings';
import InfoModal from './components/InfoModal';
import SettingsModal from './components/SettingsModal';
import { log, logError } from './utils/logger';

// Main App component
const App = () => {
  const [messages, setMessages] = useState([]);
  const [totalPercentageSaved, setTotalPercentageSaved] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Log component lifecycle
  useEffect(() => {
    log('App component mounted');
    return () => {
      log('App component unmounted');
    };
  }, []);

  // Function to handle sending messages to the SUSTAIN API
  const handleSendMessage = async (userInput) => {
    setMessages([...messages, { sender: 'You', text: userInput }]);
    log(`User sent message: ${userInput}`);
  
    // Send message to SUSTAIN API
    try {
      const url = 'http://localhost:3001/api/sustain';
      log(`Sending POST request to: ${url}`);
  
      // Make a POST request to the SUSTAIN API
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput }),
      });
  
      // Check for errors in the response
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Parse the JSON response
      const data = await response.json();
      console.log("API Response:", data); // 🔍 Debugging: Check API response format
  
      // Check if the response format is as expected
      if (!data.responseText || typeof data.percentageSaved !== "number") {
        console.error("Unexpected API response format:", data);
        return;
      }
  
      // Destructure the response data
      const { responseText, percentageSaved } = data;
      
      // Update the chat area with the response
      setMessages([...messages, 
        { sender: 'You', text: userInput }, 
        { sender: 'SUSTAIN', text: responseText, percentageSaved }
      ]);
  
      // Update the total percentage saved and message count
      setTotalPercentageSaved(totalPercentageSaved + percentageSaved);
      setMessageCount(messageCount + 1);
      log(`SUSTAIN responded with: ${responseText}, Percentage saved: ${percentageSaved}`);
  
      // Log the average savings per message
    } catch (error) {
      logError(error);
      console.error('Error sending message:', error);
    }
  };

  // Calculate the average savings per message
  const averageSavings = messageCount > 0 ? (totalPercentageSaved / messageCount).toFixed(2) : 0;

  // Return the JSX for the component
  return (
    <div className={`App ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <header className="App-header">
        <img 
          src={`${process.env.PUBLIC_URL}/${darkMode ? 'SUSTAINOriginalWhiteTransparentCropped.png' : 'SUSTAINOriginalBlackTransparentCropped.png'}`} 
          alt="SUSTAIN Logo" 
          className="App-logo" 
        />
        <div className="button-group">
          <button className="Info-button" onClick={() => setShowInfo(true)}>?</button>
          <button className="Settings-button" onClick={() => setShowSettings(true)}>⚙️</button>
        </div>
      </header>
      <ChatArea messages={messages} />
      <InputArea className={darkMode ? 'dark-mode' : 'light-mode'} onSendMessage={handleSendMessage} />
      <TokenSavings averageSavings={averageSavings} />
      {showInfo && <InfoModal onClose={() => setShowInfo(false)} darkMode={darkMode} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} darkMode={darkMode} setDarkMode={setDarkMode} />}
    </div>
  );
};

// Export the component
export default App;
