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
  const [co2Savings, setCo2Savings] = useState(null);
  const [loadingCo2, setLoadingCo2] = useState(false);
  const API_BASE_URL = 'https://sustain-backend.azurewebsites.net';

  // Load Dark Mode Preference from Local Storage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    log(`Dark mode loaded: ${savedDarkMode}`);
  }, []);

  // Toggle Dark Mode & Save Preference
  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", newMode);
      return newMode;
    });
  };

  // Handle Sending Messages to SUSTAIN API
  const handleSendMessage = async (userInput) => {
    log(`User sent message: ${userInput}`);

    // Optimistically update UI
    setMessages(prevMessages => [...prevMessages, { sender: 'You', text: userInput }]);

    try {
      const response = await fetch(`${API_BASE_URL}/api/sustain`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput }),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      const { responseText, percentageSaved } = data;

      // Ensure valid response format
      if (!responseText || typeof percentageSaved !== "number") {
        console.error("Unexpected API response format:", data);
        return;
      }

      // Update Chat UI
      setMessages(prevMessages => [
        ...prevMessages,
        { sender: 'SUSTAIN', text: responseText, percentageSaved }
      ]);

      // Update Token Savings
      setTotalPercentageSaved(prevTotal => prevTotal + percentageSaved);
      setMessageCount(prevCount => prevCount + 1);

      log(`SUSTAIN responded: "${responseText}", Tokens saved: ${percentageSaved}%`);
    } catch (error) {
      logError(error);
      console.error('Error sending message:', error);
    }
  };

  // Fetch CO₂ Savings
  const fetchCo2Savings = async () => {
    setLoadingCo2(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/sustain/co2-savings`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setCo2Savings(data);
      log(`CO₂ savings fetched: ${JSON.stringify(data)}`);
    } catch (error) {
      logError(error);
      console.error("Failed to fetch CO₂ savings:", error);
    } finally {
      setLoadingCo2(false);
    }
  };

  // Calculate Average Savings
  const averageSavings = messageCount > 0 ? (totalPercentageSaved / messageCount).toFixed(2) : 0;

  return (
    <div className={`App ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <header className="App-header">
        <img 
          src={`${process.env.PUBLIC_URL}/${darkMode ? 'SUSTAINOriginalWhiteTransparentCropped.png' : 'SUSTAINOriginalBlackTransparentCropped.png'}`} 
          alt="SUSTAIN Logo" 
          className="App-logo" 
        />
        <div className="hint">Ask me: 'What is SUSTAIN?'</div>
        <div className="button-group">
          <button className="Info-button" onClick={() => setShowInfo(true)}>?</button>
          <button className="Settings-button" onClick={() => setShowSettings(true)}>⚙️</button>
        </div>
      </header>

      {/* Chat Area & Input */}
      <ChatArea messages={messages} />
      <InputArea className={darkMode ? 'dark-mode' : 'light-mode'} onSendMessage={handleSendMessage} />
      <TokenSavings averageSavings={averageSavings} co2Savings={co2Savings} />

      {/* Modals */}
      {showInfo && <InfoModal onClose={() => setShowInfo(false)} darkMode={darkMode} />}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          fetchCo2Savings={fetchCo2Savings}
          co2Savings={co2Savings}
          loadingCo2={loadingCo2}
          apiBaseUrl={API_BASE_URL}
        />
      )}
    </div>
  );
};

export default App;