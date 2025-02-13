/*
Description: This utility module provides logging functionality for the application.
*/

// Log a message with a specific level
const log = (message, level = 'INFO') => {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${level} - ${message}`;
  console.log(logMessage);

  // Store logs in localStorage for persistence
  const logs = JSON.parse(localStorage.getItem('appLogs')) || [];
  logs.push(logMessage);
  localStorage.setItem('appLogs', JSON.stringify(logs));
};

// Log an error message
const logError = (error) => {
  log(error.message, 'ERROR');
  if (error.stack) {
    log(error.stack, 'ERROR');
  }
};

const getLogs = () => {
  return JSON.parse(localStorage.getItem('appLogs')) || [];
};

module.exports = { log, logError, getLogs };
