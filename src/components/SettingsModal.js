/**
 * SettingsModal Component
 * 
 * This component provides a modal dialog for users to adjust application settings,
 * including toggling dark mode, selecting AI models, and calculating CO₂ savings.
 * 
 * Author: SUSTAIN Development Team
 * Last Modified: Jan 2026
 */

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './SettingsModal.css';

const SettingsModal = ({ onClose, darkMode, setDarkMode, apiBaseUrl, model, setModel }) => {
  /**
   * SettingsModal component to adjust app settings.
   * 
   * @param {Function} onClose - Function to call when the modal is closed.
   * @param {boolean} darkMode - Flag indicating if dark mode is enabled.
   * @param {Function} setDarkMode - Function to toggle dark mode.
   * @param {string} apiBaseUrl - Base URL for the API.
   * @param {string} model - Currently selected AI model.
   * @param {Function} setModel - Function to set the selected AI model.
   * @returns {JSX.Element} The rendered SettingsModal component.
   */
  const [co2Savings, setCo2Savings] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode);
  };

  useEffect(() => {
    /**
     * Restores dark mode setting from local storage on component mount.
     * 
     * @param {Function} setDarkMode - Function to set dark mode state.
     */
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

  const handleModelChange = (e) => {
    /**
     * Handles changes to the selected AI model.
     * 
     * @param {Object} e - The event object from the select input.
     */
    const newModel = e.target.value;
    setModel(newModel);
  };

  const handleKeyDown = (event, callback) => {
    /**
     * Handles keyboard events for accessibility, triggering callback on Enter or Space key.
     * 
     * @param {Object} event - The keyboard event object.
     * @param {Function} callback - The function to call when the key is pressed.
     */
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
      open
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
