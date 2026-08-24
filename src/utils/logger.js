/**
 * Logger Utility
 * Provides logging functionalities for the application.
 * 
 * Author: SUSTAIN Development Team
 * Last Modified: Jan 2026
 */

// Maximum number of log entries kept in localStorage, so the store can't grow
// unbounded and eventually throw when it hits the quota.
const MAX_LOGS = 500;

const readStoredLogs = () => {
  /**
   * Safely reads the persisted log array from localStorage.
   * Returns an empty array if nothing is stored or the value is corrupt.
   * Enforces the MAX_LOGS cap on read as well, so a legacy/oversized store
   * (written by an older version or manually tampered) can't return an
   * unbounded array to callers.
   *
   * @returns {Array} An array of log messages.
   */
  try {
    const stored = JSON.parse(localStorage.getItem('appLogs'));
    if (!Array.isArray(stored)) {
      return [];
    }
    return stored.length > MAX_LOGS ? stored.slice(-MAX_LOGS) : stored;
  } catch {
    // Corrupt/non-JSON value in storage - start fresh rather than throwing.
    return [];
  }
};

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
  const logs = readStoredLogs();
  logs.push(logMessage);
  if (logs.length > MAX_LOGS) {
    logs.splice(0, logs.length - MAX_LOGS);
  }
  try {
    localStorage.setItem('appLogs', JSON.stringify(logs));
  } catch {
    // Storage unavailable or quota exceeded - logging must never break callers.
  }
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
  return readStoredLogs();
};

module.exports = { log, logError, getLogs };
