import { z } from 'zod';
import { Worker } from 'worker_threads';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { log } from '../utils/simpleLog.js';
import { isPathAllowed } from '../utils/configValidator.js';

// Define the parameters schema
export const TerminalParametersSchema = z.object({
  command: z.string().describe('Terminal command to execute'),
  workingDir: z.string().describe('Working directory for command execution')
});

export const terminalTool = {
  name: 'terminal',
  description: 'Execute terminal commands in a specified directory in macbook',
  inputSchema: {
    type: 'object',
    properties: {
      command: {
        type: 'string',
        description: 'Terminal command to execute'
      },
      workingDir: {
        type: 'string',
        description: 'Working directory for command execution'
      }
    },
    required: ['command', 'workingDir']
  },
  parameters: TerminalParametersSchema,
  
  async execute(params) {
    log(`TERMINAL: Tool Execute - Input params: ${JSON.stringify(params)}`);
    
    return new Promise((resolve) => {
      try {
        // Validate working directory against allowed paths
        if (!isPathAllowed(params.workingDir)) {
          const response = {
            content: [{
              type: 'text',
              text: `Access denied: Working directory ${params.workingDir} is not allowed`
            }]
          };
          log(`TERMINAL: Access denied for directory: ${params.workingDir}`);
          resolve(response);
          return;
        }

        log(`TERMINAL: - Starting worker thread`);
        
        // Initialize worker
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const workerPath = join(__dirname, 'terminal-worker.js');
        
        log(`TERMINAL: - Worker path: ${workerPath}`);
        const worker = new Worker(workerPath);

        worker.on('message', (message) => {
          if (message.type === 'result') {
            if (message.logs && Array.isArray(message.logs)) {
              message.logs.forEach((logMsg) => log(`TERMINAL: ${logMsg}`));
            }
            
            if (message.error) {
              const response = {
                content: [{
                  type: 'text',
                  text: `Command execution error: ${message.error}`
                }]
              };
              log(`TERMINAL: - Worker reported error: ${message.error}`);
              resolve(response);
            } else {
              const response = {
                content: [{
                  type: 'text',
                  text: message.code === 0 ? message.stdout : (message.stderr || `Process exited with code ${message.code}`)
                }]
              };
              log(`TERMINAL: - Worker completed successfully with code: ${message.code}`);
              resolve(response);
            }
            worker.terminate();
          }
        });

        worker.on('error', (error) => {
          const response = {
            content: [{
              type: 'text',
              text: `Worker error: ${error.message}`
            }]
          };
          log(`TERMINAL: - Worker error: ${error.message}`);
          resolve(response);
          worker.terminate();
        });

        log(`TERMINAL: - Sending command to worker`);
        worker.postMessage({
          command: params.command,
          workingDir: params.workingDir
        });

      } catch (error) {
        const response = {
          content: [{
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
        log(`TERMINAL: - Execution error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        resolve(response);
      }
    });
  }
};
