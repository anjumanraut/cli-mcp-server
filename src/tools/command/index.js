import { executeCommand } from './executor.js';
import { CommandParametersSchema, COMMAND_DESCRIPTIONS } from './schema.js';
import { log } from '../../utils/logging.js';
import { checkPathAllowed } from '../../config/index.js';

/**
 * Command tool implementation for MCP
 */
export const commandTool = {
  name: 'command',
  description: 'Execute commands in a specified directory',
  inputSchema: {
    type: 'object',
    properties: {
      command: {
        type: 'string',
        description: COMMAND_DESCRIPTIONS.command
      },
      workingDir: {
        type: 'string',
        description: COMMAND_DESCRIPTIONS.workingDir
      }
    },
    required: ['command', 'workingDir']
  },
  parameters: CommandParametersSchema,
  
  /**
   * Execute the command tool
   * @param {Object} params - Tool parameters
   * @returns {Promise<Object>} Tool execution result
   */
  async execute(params) {
    log(`COMMAND: Tool Execute - Input params: ${JSON.stringify(params)}`);
    
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
      return await executeCommand(params.command, params.workingDir);
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
