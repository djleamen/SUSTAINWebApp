/**
 * Entry point for the SUSTAIN web application.
 * 
 * This file initializes the React application by rendering the main App component
 * into the root HTML element. It also sets up logging for application start events.
 * 
 * Author: SUSTAIN Development Team
 * Last Modified: Jan 2026
 */

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './App.css';

const { log, logError } = require('./utils/logger');

log('Application has started');
log('Logging system is operational');

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
