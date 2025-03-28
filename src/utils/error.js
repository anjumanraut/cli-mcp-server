import { log } from './logging.js';

/**
 * Setup global error handlers
 */
export function setupErrorHandlers() {
  // Add global error handlers
  process.on('uncaughtException', (error) => {
    log(`Uncaught Exception: ${error instanceof Error ? error.message : String(error)}`);
  });

  process.on('unhandledRejection', (reason) => {
    log(`Unhandled Rejection: ${String(reason)}`);
  });
}

/**
 * Setup handlers for graceful shutdown
 * @param {Object} server - The MCP server instance
 */
export function setupShutdownHandlers(server) {
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    log('Received SIGINT signal');
    await server.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    log('Received SIGTERM signal');
    await server.close();
    process.exit(0);
  });
}
