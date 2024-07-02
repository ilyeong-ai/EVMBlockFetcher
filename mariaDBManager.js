/**
 * mariaDBManager.js
 * @license MIT
 * @author Brian Lee
 */

const mysql = require('mysql2/promise');
// MariaDB Manager class
class MariaDBManager {
  constructor(config, logger) {
    this.config = config;
    // Create connection pool
    this.pool = mysql.createPool(this.config);
    this.logger = logger;
    this.logger.info('Database connection pool created'); // Log pool creation
  }

  // Method to execute query
  async query(sql, params) {
    let connection;
    try {
      // Get connection from pool
      connection = await this.pool.getConnection();
      // Execute query
      const [results] = await connection.execute(sql, params);
      this.logger.info(`Query executed: ${sql}`); // Log query execution
      return results;
    } catch (error) {
      this.logger.error(`Query error: ${error.message}`); // Log query error
      throw error;
    } finally {
      if (connection) {
        // Release connection back to pool
        connection.release();
        this.logger.info('Connection released back to pool'); // Log connection release
      }
    }
  }

  // Method to close connection pool
  async close() {
    try {
      // Close connection pool
      await this.pool.end();
      this.logger.info('Database connection pool closed'); // Log pool closure
    } catch (error) {
      this.logger.error(`Error closing the database connection pool: ${error.message}`); // Log pool closure error
      throw error;
    }
  }
}

module.exports = MariaDBManager; // Export MariaDBManager class as module