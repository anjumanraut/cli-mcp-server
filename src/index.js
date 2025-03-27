import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { terminalTool } from './tools/TerminalTool.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { log } from './utils/simpleLog.js';
import { join } from 'path';
import { writeFile } from 'fs/promises';
import { loadConfig } from './utils/configValidator.js';

const PID_FILE = join(process.cwd(), 'cli-mcp-server.pid');

// Add global error handlers
process.on('uncaughtException', (error) => {
  log(`Uncaught Exception: ${error instanceof Error ? error.message : String(error)}`);
});

process.on('unhandledRejection', (reason) => {
  log(`Unhandled Rejection: ${String(reason)}`);
});

const startServer = async () => {
  try {
    // Load config first
    await loadConfig();

    // Debug logging for all requests
    const logRequest = async (request) => {
      log(`Received request: ${JSON.stringify(request)}`);
    };

    log('Starting CLI MCP server...');
    log(`Current working directory: ${process.cwd()}`);
    log(`Process arguments: ${JSON.stringify(process.argv)}`);

    const server = new Server(
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

    // Write PID to file
    await writeFile(PID_FILE, process.pid.toString());

    // Register tool handlers
    server.setRequestHandler(ListToolsRequestSchema, async (request) => {
      await logRequest(request);
      return {
        tools: [terminalTool]
      };
    });

    server.setRequestHandler(CallToolRequestSchema, async (request) => {
      await logRequest(request);
      
      if (!request.params) {
        log('Request missing parameters');
        return {
          content: [{
            type: 'text',
            text: 'Missing parameters'
          }]
        };
      }

      if (!request.params.arguments) {
        log('Request missing command arguments');
        return {
          content: [{
            type: 'text',
            text: 'Missing command arguments'
          }]
        };
      }

      log(`Received arguments: ${JSON.stringify(request.params.arguments)}`);

      try {
        if (request.params.name === terminalTool.name) {
          const args = terminalTool.parameters.parse(request.params.arguments);
          log(`Parsed Terminal arguments: ${JSON.stringify(args)}`);
          const result = await terminalTool.execute(args);
          log(`Terminal execution result: ${JSON.stringify(result)}`);
          return result;
        } else {
          log(`Unknown tool requested: ${request.params.name}`);
          return {
            content: [{
              type: 'text',
              text: `Unknown tool: ${request.params.name}`
            }]
          };
        }
      } catch (error) {
        log(`Error executing command: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return {
          content: [{
            type: 'text',
            text: error instanceof Error ? error.message : 'Unknown error occurred'
          }]
        };
      }
    });

    // Initialize transport
    const transport = new StdioServerTransport();

    // Connect transport
    await server.connect(transport);

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

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown startup error';
    log(`Server startup error: ${errorMessage}`);
    process.exit(1);
  }
};

// Start the server
startServer().catch(error => {
  const errorMessage = error instanceof Error ? error.message : 'Unknown fatal error';
  log(`Fatal server error: ${errorMessage}`);
  process.exit(1);
});
