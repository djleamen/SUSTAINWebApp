/*
Description: This component is a modal that displays the settings of the app. 
It has buttons for toggling dark mode and calculating CO₂ savings.
*/

// Required imports
import React, { useState, useEffect } from 'react';
import './SettingsModal.css';

const SettingsModal = ({ onClose, darkMode, setDarkMode }) => {
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
  }, []);

  // Fetch CO₂ Savings
  const fetchCo2Savings = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/sustain/co2-savings');
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      
      const data = await response.json();
      setCo2Savings(data);
    } catch (error) {
      console.error("Failed to fetch CO₂ savings:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="SettingsModal" onClick={onClose}>
      <div 
        className={`SettingsModal-content ${darkMode ? "dark-mode" : "light-mode"}`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <h2 className="settings-header">Settings</h2>

        {/* Dark Mode Toggle */}
        <button onClick={toggleDarkMode} className="dark-mode-toggle">
          {darkMode ? "🌙 Dark Mode Enabled" : "☀️ Light Mode Enabled"}
        </button>

        {/* CO₂ Savings Button */}
        <button onClick={fetchCo2Savings} className="calculate-co2-button">
          {loading ? "Calculating..." : "Calculate CO₂ Savings"}
        </button>

        {/* Display CO₂ Savings Results */}
        {co2Savings && (
          <p className="co2-text">
            If you keep using SUSTAIN at this pace for a year, you'll save:
            <br />
            🌱 {co2Savings.totalKwhSaved} kWh of power
            <br />
            🌍 {co2Savings.totalCo2Saved} metric tons of CO₂ emissions
          </p>
        )}
      </div>
    </div>
  );
};

export default SettingsModal;