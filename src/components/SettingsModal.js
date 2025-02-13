/*
Description: This component is a modal that displays the settings of the app. 
It has a button that allows the user to switch between dark and light mode.
*/

// Required imports
import React from 'react';
import './SettingsModal.css';

// Display the settings modal
const SettingsModal = ({ onClose, darkMode, setDarkMode }) => {
  const handleClickOutside = (e) => {
    if (e.target.className === 'SettingsModal') {
      onClose();
    }
  };

  // Return the JSX for the component
  return (
    <div className="SettingsModal" onClick={handleClickOutside}>
      <div className={`SettingsModal-content ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <h2>Settings</h2>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
      </div>
    </div>
  );
};

// Export the component
export default SettingsModal;
