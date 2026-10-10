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
import { createRoot } from 'react-dom/client';
import App from './App';
import './App.css';

const { log, logError } = require('./utils/logger');

log('Application has started');
log('Logging system is operational');

try {
  // React 18+ removed ReactDOM.render; use the createRoot API (react-dom
  // and react are pinned to v19, where ReactDOM.render no longer exists).
  const root = createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  log('React root rendered successfully');
} catch (error) {
  logError(error);
}
