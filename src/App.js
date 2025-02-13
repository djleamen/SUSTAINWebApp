import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ChatArea from './components/ChatArea';
import InputArea from './components/InputArea';
import TokenSavings from './components/TokenSavings';
import InfoModal from './components/InfoModal';
import { log, logError } from './utils/logger';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [totalPercentageSaved, setTotalPercentageSaved] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

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
    <div className="App">
      <header className="App-header">
        <img src={`${process.env.PUBLIC_URL}/sustain_logo.png`} alt="SUSTAIN Logo" className="App-logo" />
        <button className="Info-button" onClick={() => setShowInfo(true)}>?</button>
      </header>
      <ChatArea messages={messages} />
      <InputArea onSendMessage={handleSendMessage} />
      <TokenSavings averageSavings={averageSavings} />
      {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}
    </div>
  );
};

export default App;
