/**
 * logger.js
 * @license MIT
 * @author Brian Lee
 */

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

/**
 * Logger class to handle logging.
 */
class Logger {
  constructor(network, networkId) {
    // Log file name based on network and network ID
    this.logFileName = `${network}_${networkId}.log`;
    const logFormat = printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level}]: ${message}`;
    });

    // Create a Winston logger instance
    this.logger = createLogger({
      level: 'info', // Default log level
      format: combine(
        timestamp(),
        logFormat
      ),
      transports: [
        new transports.Console({
          format: combine(
            colorize(),
            logFormat
          )
        }),
        new transports.File({ filename: this.logFileName }) // Save logs to file
      ],
    });
  }

  // Method to log info messages
  info(message) {
    this.logger.info(message);
  }

  // Method to log error messages
  error(message) {
    this.logger.error(message);
  }
}

module.exports = Logger;