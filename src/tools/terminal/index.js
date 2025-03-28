import { executeTerminalCommand } from './executor.js';
import { TerminalParametersSchema } from './schema.js';
import { log } from '../../utils/logging.js';
import { checkPathAllowed } from '../../config/index.js';

/**
 * Terminal tool implementation for MCP
 */
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
  
  /**
   * Execute the terminal tool
   * @param {Object} params - Tool parameters
   * @returns {Promise<Object>} Tool execution result
   */
  async execute(params) {
    log(`TERMINAL: Tool Execute - Input params: ${JSON.stringify(params)}`);
    
    // Validate working directory against allowed paths
    if (!checkPathAllowed(params.workingDir)) {
      return {
        content: [{
          type: 'text',
          text: `Access denied: Working directory ${params.workingDir} is not allowed`
        }]
      };
    }
    
    try {
      return await executeTerminalCommand(params.command, params.workingDir);
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        }]
      };
    }
  }
};
