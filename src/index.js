import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './App.css'; // Update the CSS file reference

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
