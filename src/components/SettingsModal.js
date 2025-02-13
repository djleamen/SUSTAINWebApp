import React from 'react';
import './SettingsModal.css';

const SettingsModal = ({ onClose, darkMode, setDarkMode }) => {
  const handleClickOutside = (e) => {
    if (e.target.className === 'SettingsModal') {
      onClose();
    }
  };

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

export default SettingsModal;
