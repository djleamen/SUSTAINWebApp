/*
Description: This component is a modal that displays the settings of the app. 
It has buttons for toggling dark mode and calculating CO₂ savings.
*/

// Required imports
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './SettingsModal.css';

const SettingsModal = ({ onClose, darkMode, setDarkMode, apiBaseUrl, model, setModel }) => {
  const [co2Savings, setCo2Savings] = useState(null);
  const [loading, setLoading] = useState(false);

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode);
  };

  // Restore dark mode from local storage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
  }, [setDarkMode]);

  // Fetch CO₂ Savings
  const fetchCo2Savings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/sustain/co2-savings`);  // Use apiBaseUrl instead of API_BASE_URL
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
      const data = await response.json();
      setCo2Savings(data);
    } catch (error) {
      console.error("Failed to fetch CO₂ savings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Model Change
  const handleModelChange = (e) => {
    const newModel = e.target.value;
    setModel(newModel);
  };

  // Handle keyboard events for accessibility
  const handleKeyDown = (event, callback) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  };

  return (
    <dialog 
      className="SettingsModal" 
      onClick={onClose}
      onKeyDown={(e) => handleKeyDown(e, onClose)}
      aria-modal="true"
      aria-labelledby="settings-header"
    >
      <div 
        className={`SettingsModal-content ${darkMode ? "dark-mode" : "light-mode"}`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        onKeyDown={(e) => e.stopPropagation()}
      >
        <h2 id="settings-header" className="settings-header">Settings</h2>
  
        {/* Model Selection - Styled as a Green Bubble */}
        <div className="model-selector-container">
          <label htmlFor="model-select">Choose Model:</label>
           <select id="model-select" value={model} onChange={handleModelChange}>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
           <option value="gpt-4o">GPT-4o</option>
          </select>
        </div>
  
        {/* Dark Mode Toggle */}
        <button onClick={toggleDarkMode} className="dark-mode-toggle">
          {darkMode ? "🌙 Dark Mode Enabled" : "☀️ Light Mode Enabled"}
        </button>
  
        {/* CO₂ Savings Button */}
        <button onClick={fetchCo2Savings} className="calculate-co2-button">
          {loading ? "Calculating..." : "Calculate CO₂ Savings"}
        </button>
  
        {/* Display CO₂ Savings Results */}
        {co2Savings && co2Savings.totalKwhSaved > 0 && (
          <p className="co2-text">
            By using SUSTAIN instead of traditional AI, you have saved:
            <br />
            🌱 {co2Savings.totalKwhSaved} kWh of power
            <br />
            🌍 {co2Savings.totalCo2Saved} metric tons of CO₂ emissions
          </p>
        )}
      </div>
    </dialog>
  );
};

// PropTypes validation
SettingsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
  setDarkMode: PropTypes.func.isRequired,
  apiBaseUrl: PropTypes.string.isRequired,
  model: PropTypes.string.isRequired,
  setModel: PropTypes.func.isRequired
};

export default SettingsModal;