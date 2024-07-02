/**
 * blockFetcher.js
 * @license MIT
 * @author Brian Lee
 */
const { ethers } = require('ethers');
const Logger = require('./logger');
const FileManager = require('./fileManager');
const MariaDBManager = require('./mariaDBManager');


/**
 * BlockFetcher class to fetch and process blockchain blocks.
 */
class BlockFetcher {
  constructor(network, networkId, rpcUrl, sleepTime, interval, db_host, db_port, db_id, db_pw, db_name) {
    this.network = network;
    this.networkId = networkId;
    this.rpcUrl = rpcUrl;

    // Initialize logger
    this.logger = new Logger(network, networkId);

    // Initialize JSON RPC provider
    this.provider = new ethers.JsonRpcProvider(rpcUrl, new ethers.Network(network, networkId), {
      staticNetwork: new ethers.Network(network, networkId),
    });

	const dbConfig = {
	  host: db_host,
	  port: db_port,
	  user: db_id,
	  password: db_pw,
	  database: db_name,
	  waitForConnections: true, // Allow waiting for connections
	  connectionLimit: 10, // Maximum number of connections
	  queueLimit: 0 // No limit for the queue
	};

	this.db = new MariaDBManager(dbConfig, this.logger);
	
    this.saveFileName = `${network}_${networkId}.save`;
    this.sleepTime = sleepTime;
    this.interval = interval;
    this.lastBlockNumber = 0;

    // Initialize last block number
    this.initializeLastBlockNumber();
  }

  /**
   * Initialize the last block number by reading from a file.
   */
  async initializeLastBlockNumber() {
    this.lastBlockNumber = await FileManager.readNumberFromFile(this.logger, this.saveFileName);
  }

  /**
   * Execute the task of fetching and processing blocks.
   */
  async executeTask() {
    try {
      let latestBlock = await this.provider.getBlockNumber();
      this.logger.info('latest block : ' + latestBlock);

      // Process blocks from last saved block number to the latest block number
      while (latestBlock > this.lastBlockNumber) {
        // Process block data here
		try {
			// Execute a database query
			const results = await this.db.query('SELECT * FROM blocks');
			console.log(results); // Output query results
		} catch (error) {
			console.error('Database query failed', error); // Output query failure error
		} finally {
		}
		this.lastBlockNumber++;
      }

      // Save the last processed block number to a file
      FileManager.saveNumberToFile(this.logger, this.lastBlockNumber, this.saveFileName);

      // Sleep for a specified duration
      await this.sleep(this.sleepTime);
    } catch (error) {
      this.logger.error('Error fetching block data:', error);
    }
  }

  /**
   * Sleep for a specified number of milliseconds.
   * @param {number} ms - Number of milliseconds to sleep.
   * @returns {Promise<void>}
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Start the loop to fetch and process blocks at regular intervals.
   */
  startLoop() {
    setInterval(() => {
      this.executeTask();
    }, this.interval);
  }
}

module.exports = BlockFetcher;