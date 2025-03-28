import { initServer } from './core/server.js';
import { setupErrorHandlers } from './utils/error.js';
import { log } from './utils/logging.js';

// Initialize error handlers
setupErrorHandlers();

// Start the server
initServer()
  .then(() => {
    log('Server started successfully');
  })
  .catch(error => {
    log(`Fatal server error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  });
