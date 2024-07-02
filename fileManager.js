/**
 * fileManager.js
 * @license MIT
 * @author Brian Lee
 */

const fs = require('fs').promises;

/**
 * FileManager class to handle file operations.
 */
class FileManager {
  /**
   * Save a number to a file.
   * @param {Logger} logger - Logger instance for logging errors.
   * @param {number} number - Number to save.
   * @param {string} filename - File name to save the number in.
   */
  static async saveNumberToFile(logger, number, filename) {
    try {
      await fs.writeFile(filename, number.toString());
    } catch (err) {
      logger.error('saveNumberToFile():', err);
    }
  }

  /**
   * Read a number from a file.
   * @param {Logger} logger - Logger instance for logging errors.
   * @param {string} filename - File name to read the number from.
   * @returns {Promise<number>} - The number read from the file.
   */
  static async readNumberFromFile(logger, filename) {
    try {
      const data = await fs.readFile(filename, 'utf8');
      return parseInt(data, 10);
    } catch (err) {
      logger.error('readNumberFromFile():', err);
      return 0; // Return default value in case of error
    }
  }
}

module.exports = FileManager;