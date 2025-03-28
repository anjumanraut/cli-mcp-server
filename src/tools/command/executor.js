import { Worker } from 'worker_threads';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { log } from '../../utils/logging.js';

/**
 * Execute a command in the specified working directory
 * @param {string} command - The command to execute
 * @param {string} workingDir - The working directory for execution
 * @returns {Promise<Object>} Result of command execution
 */
export async function executeCommand(command, workingDir) {
  return new Promise((resolve) => {
    try {
      log(`COMMAND: - Starting worker thread`);
      
      // Initialize worker
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      const workerPath = join(__dirname, 'worker.js');
      
      log(`COMMAND: - Worker path: ${workerPath}`);
      const worker = new Worker(workerPath);

      worker.on('message', (message) => {
        handleWorkerMessage(message, worker, resolve);
      });

      worker.on('error', (error) => {
        const response = {
          content: [{
            type: 'text',
            text: `Worker error: ${error.message}`
          }]
        };
        log(`COMMAND: - Worker error: ${error.message}`);
        resolve(response);
        worker.terminate();
      });

      log(`COMMAND: - Sending command to worker`);
      worker.postMessage({
        command,
        workingDir
      });
    } catch (error) {
      const response = {
        content: [{
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        }]
      };
      log(`COMMAND: - Execution error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      resolve(response);
    }
  });
}

/**
 * Handle messages from the worker thread
 * @param {Object} message - Message from worker
 * @param {Worker} worker - Worker instance
 * @param {Function} resolve - Promise resolve function
 */
function handleWorkerMessage(message, worker, resolve) {
  if (message.type === 'result') {
    if (message.logs && Array.isArray(message.logs)) {
      message.logs.forEach((logMsg) => log(`COMMAND: ${logMsg}`));
    }
    
    if (message.error) {
      const response = {
        content: [{
          type: 'text',
          text: `Command execution error: ${message.error}`
        }]
      };
      log(`COMMAND: - Worker reported error: ${message.error}`);
      resolve(response);
    } else {
      const response = {
        content: [{
          type: 'text',
          text: message.code === 0 ? message.stdout : (message.stderr || `Process exited with code ${message.code}`)
        }]
      };
      log(`COMMAND: - Worker completed successfully with code: ${message.code}`);
      resolve(response);
    }
    worker.terminate();
  }
}
