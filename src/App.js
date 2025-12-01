import React, { useState, useEffect } from 'react';
import './App.css';
import ChatArea from './components/ChatArea';
import InputArea from './components/InputArea';
import TokenSavings from './components/TokenSavings';
import InfoModal from './components/InfoModal';
import SettingsModal from './components/SettingsModal';
import { log, logError } from './utils/logger';
import MathOptimizer from './utils/MathOptimizer';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [totalPercentageSaved, setTotalPercentageSaved] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [co2Savings, setCo2Savings] = useState(null);
  const [loadingCo2, setLoadingCo2] = useState(false);
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [isMobile, setIsMobile] = useState(false);
  const API_BASE_URL = 'https://sustain-backend.azurewebsites.net';

  const mathOptimizer = new MathOptimizer(); 

  // Load Dark Mode Preference from Local Storage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    log(`Dark mode loaded: ${savedDarkMode}`);
  }, []);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
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
  
    // Check if the input is a math expression and solve it locally
    if (mathOptimizer.recognizeMath(userInput)) {
      const result = mathOptimizer.solveMath(userInput);
      setMessages(prevMessages => [
        ...prevMessages,
        { sender: 'SUSTAIN', text: `Math detected! Result: ${result}`, percentageSaved: 100 }
      ]);
  
      // Update Token Savings
      setTotalPercentageSaved(prevTotal => prevTotal + 100);
      setMessageCount(prevCount => prevCount + 1);
  
      return;
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/api/sustain`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput, model }),
      });
  
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
      const data = await response.json();
      const { responseText, percentageSaved } = data;
  
      // Ensure valid response format
      if (!responseText || typeof percentageSaved !== "number") {
        console.error("Unexpected API response format:", data);
        setMessages(prevMessages => [
          ...prevMessages,
          { sender: 'SUSTAIN', text: 'Sorry, I encountered an error processing your request.', percentageSaved: 0 }
        ]);
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
      
      // Show user-friendly error message
      setMessages(prevMessages => [
        ...prevMessages,
        { sender: 'SUSTAIN', text: 'Sorry, I encountered an error. Please try again.', percentageSaved: 0 }
      ]);
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

  // Handle Model Change
  const handleModelChange = (newModel) => {
    setModel(newModel);
    setMessages(prevMessages => [
      ...prevMessages,
      { sender: 'System', text: `Now using ${newModel}`, system: true }
    ]);
  };

  // Calculate Average Savings
  const averageSavings = messageCount > 0 ? (totalPercentageSaved / messageCount).toFixed(2) : 0;

  if (isMobile) {
    return (
      <div className="overlay">
        <div className="overlay-content">
          <h2>Desktop Only</h2>
          <p>SUSTAIN is only available on desktop. Please visit us on a desktop device.</p>
        </div>
      </div>
    );
  }

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
          toggleDarkMode={toggleDarkMode}
          fetchCo2Savings={fetchCo2Savings}
          co2Savings={co2Savings}
          loadingCo2={loadingCo2}
          apiBaseUrl={API_BASE_URL}
          model={model}
          setModel={handleModelChange}
        />
      )}
    </div>
  );
};

export default App;