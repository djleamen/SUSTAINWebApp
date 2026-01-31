/**
 * Logger Utility
 * Provides logging functionalities for the application.
 * 
 * Author: SUSTAIN Development Team
 * Last Modified: Jan 2026
 */

const log = (message, level = 'INFO') => {
  /**
   * Logs a message with a timestamp and level.
   * 
   * @param {string} message - The message to log.
   * @param {string} level - The log level (e.g., INFO, ERROR).
   */
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
  /**
   * Logs an error message with stack trace.
   * 
   * @param {Error} error - The error object to log.
   */
  log(error.message, 'ERROR');
  if (error.stack) {
    log(error.stack, 'ERROR');
  }
};

const getLogs = () => {
  /**
   * Retrieves all stored log messages.
   * 
   * @returns {Array} An array of log messages.
   */
  return JSON.parse(localStorage.getItem('appLogs')) || [];
};

module.exports = { log, logError, getLogs };
