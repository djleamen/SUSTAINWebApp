import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ChatArea from './components/ChatArea';
import InputArea from './components/InputArea';
import TokenSavings from './components/TokenSavings';
import InfoModal from './components/InfoModal';
import SettingsModal from './components/SettingsModal';
import { log, logError } from './utils/logger';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [totalPercentageSaved, setTotalPercentageSaved] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    log('App component mounted');
    return () => {
      log('App component unmounted');
    };
  }, []);

  const handleSendMessage = async (userInput) => {
    setMessages([...messages, { sender: 'You', text: userInput }]);
    log(`User sent message: ${userInput}`);
  
    try {
      const url = 'http://localhost:3001/api/sustain';
      log(`Sending POST request to: ${url}`);
  
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("API Response:", data); // 🔍 Debugging: Check API response format
  
      // ✅ Ensure response includes percentageSaved
      if (!data.responseText || typeof data.percentageSaved !== "number") {
        console.error("Unexpected API response format:", data);
        return;
      }
  
      const { responseText, percentageSaved } = data;
      
      // ✅ Make sure percentageSaved is included in SUSTAIN's response
      setMessages([...messages, 
        { sender: 'You', text: userInput }, 
        { sender: 'SUSTAIN', text: responseText, percentageSaved }
      ]);
  
      setTotalPercentageSaved(totalPercentageSaved + percentageSaved);
      setMessageCount(messageCount + 1);
      log(`SUSTAIN responded with: ${responseText}, Percentage saved: ${percentageSaved}`);
  
    } catch (error) {
      logError(error);
      console.error('Error sending message:', error);
    }
  };

  const averageSavings = messageCount > 0 ? (totalPercentageSaved / messageCount).toFixed(2) : 0;

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

export default App;
