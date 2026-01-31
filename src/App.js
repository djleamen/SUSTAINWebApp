/**
 * Main Application Component for SUSTAIN Web App
 * 
 * This component manages the overall state and layout of the SUSTAIN web application,
 * including chat interactions, settings, and CO₂ savings display.
 * 
 * Author: SUSTAIN Development Team
 * Last Modified: Jan 2026
 */

import { useState, useEffect } from 'react';
import './App.css';
import ChatArea from './components/ChatArea';
import InputArea from './components/InputArea';
import TokenSavings from './components/TokenSavings';
import InfoModal from './components/InfoModal';
import SettingsModal from './components/SettingsModal';
import { log, logError } from './utils/logger';
import MathOptimizer from './utils/MathOptimizer';

const App = () => {
  /**
   * Main App component for SUSTAIN Web Application.
   * 
   * @returns {JSX.Element} The rendered App component.
   */
  const [messages, setMessages] = useState([]);
  const [totalPercentageSaved, setTotalPercentageSaved] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [co2Savings, setCo2Savings] = useState(null);
  const [loadingCo2, setLoadingCo2] = useState(false);
  const [model, setModel] = useState('gpt-3.5-turbo'); // should update model default here... is 3.5-turbo still available?
  const [isMobile, setIsMobile] = useState(false);
  const API_BASE_URL = 'https://sustain-backend.azurewebsites.net'; // deprecated: this endpoint does not exist anymore

  const mathOptimizer = new MathOptimizer(); 

  useEffect(() => {
    /**
     * Restores dark mode setting from local storage on component mount.
     * 
     * @param {Function} setDarkMode - Function to set dark mode state.
     */
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    log(`Dark mode loaded: ${savedDarkMode}`);
  }, []);

  useEffect(() => {
    /**
     * Checks if the device is mobile based on window width.
     * 
     * @param {Function} setIsMobile - Function to set mobile state.
     */
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const toggleDarkMode = () => {
    /**
     * Toggles dark mode state and saves preference to local storage.
     * 
     * @param {Function} setDarkMode - Function to set dark mode state.
     */
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", newMode);
      return newMode;
    });
  };

  const handleSendMessage = async (userInput) => {
    /**
     * Handles sending user messages to the SUSTAIN API and updating chat state.
     * 
     * @param {string} userInput - The user's input message.
     */
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
  
      if (!responseText || typeof percentageSaved !== "number") {
        console.error("Unexpected API response format:", data);
        setMessages(prevMessages => [
          ...prevMessages,
          { sender: 'SUSTAIN', text: 'Sorry, I encountered an error processing your request.', percentageSaved: 0 }
        ]);
        return;
      }
  
      setMessages(prevMessages => [
        /**
         * Renders the SUSTAIN response message.
         * 
         * @param {Array} prevMessages - The previous array of messages.
         * @returns {Array} The updated array of messages including the new SUSTAIN response.
         */
        ...prevMessages,
        { sender: 'SUSTAIN', text: responseText, percentageSaved }
      ]);
  
      /**
       * Updates the total token savings and message count.
       * 
       * @param {Function} setTotalPercentageSaved - Function to update total token savings.
       * @param {Function} setMessageCount - Function to update message count.
       */
      
      setTotalPercentageSaved(prevTotal => prevTotal + percentageSaved);
      setMessageCount(prevCount => prevCount + 1);
  
      log(`SUSTAIN responded: "${responseText}", Tokens saved: ${percentageSaved}%`);
    } catch (error) {
      logError(error);
      console.error('Error sending message:', error);
      
      setMessages(prevMessages => [
        /**
         * Renders an error message from SUSTAIN.
         * 
         * @param {Array} prevMessages - The previous array of messages.
         * @returns {Array} The updated array of messages including the error message.
         */
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

  const handleModelChange = (newModel) => {
    /**
     * Handles changes to the selected AI model.
     * 
     * @param {string} newModel - The newly selected AI model.
     */
    setModel(newModel);
    setMessages(prevMessages => [
      ...prevMessages,
      { sender: 'System', text: `Now using ${newModel}`, system: true }
    ]);
  };

  /**
   * Calculates the average token savings per message.
   * 
   * @type {string|number} averageSavings - The average token savings as a percentage, formatted to two decimal places.
   */
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
