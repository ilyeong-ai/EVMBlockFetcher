/**
 * index.js
 * @license MIT
 * @author Brian Lee
 */

require('dotenv').config();
const BlockFetcher = require('./blockFetcher');

// Initialize BlockFetcher with environment variables
const blockFetcher = new BlockFetcher(
	process.env.NETWORK,
	process.env.NETWORK_ID,
	process.env.SILICON_RPC_TEST,
	parseInt(process.env.CONST_SLEEP),
	parseInt(process.env.CONST_INTERVAL),
	process.env.DB_HOST,
	parseInt(process.env.DB_PORT),
	process.env.DB_ID,
	process.env.DB_PW,
	process.env.DB_NAME
);

// Start the block fetching loop
blockFetcher.startLoop();