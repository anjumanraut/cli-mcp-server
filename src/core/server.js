import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { loadConfig } from '../config/index.js';
import { registerToolHandlers } from './handlers.js';
import { log } from '../utils/logging.js';
import { setupShutdownHandlers } from '../utils/error.js';

const PID_FILE = join(process.cwd(), 'cli-mcp-server.pid');

/**
 * Initialize and start the MCP server
 * @returns {Promise<Object>} The initialized server instance
 */
export async function initServer() {
  try {
    // Load config
    await loadConfig();
    
    log('Starting CLI MCP server...');
    log(`Current working directory: ${process.cwd()}`);
    log(`Process arguments: ${JSON.stringify(process.argv)}`);
    
    // Create server instance
    const server = createServerInstance();
    
    // Write PID to file
    await writeFile(PID_FILE, process.pid.toString());
    
    // Register tool handlers
    registerToolHandlers(server);
    
    // Initialize and connect transport
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    // Setup shutdown handlers
    setupShutdownHandlers(server);
    
    return server;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown startup error';
    log(`Server startup error: ${errorMessage}`);
    throw error;
  }
}

/**
 * Create a new MCP server instance
 * @returns {Server} The created server instance
 */
function createServerInstance() {
  return new Server(
    {
      name: 'cli-mcp-server',
      version: '1.0.0'
    },
    {
      capabilities: {
        tools: {
          listChanged: true
        },
        resources: {
          subscribe: false,
          listChanged: false
        },
        prompts: {
          listChanged: false
        },
        experimental: {}
      }
    }
  );
}
