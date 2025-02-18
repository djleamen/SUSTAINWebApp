/*
Description: This is the main entry point of the application. 
It renders the App component to the root element in the HTML file.
*/

// Required imports
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './App.css'; // Update the CSS file reference

// Import the logger utility
const { log, logError } = require('./utils/logger');

log('Application has started');
log('Logging system is operational');

// Render the App component to the root element in the HTML file
try {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
  log('ReactDOM.render executed successfully');
} catch (error) {
  logError(error);
}