import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { getRegisteredTools } from '../tools/index.js';
import { log } from '../utils/logging.js';

/**
 * Register all request handlers with the server
 * @param {Object} server - The MCP server instance
 */
export function registerToolHandlers(server) {
  // Register list tools handler
  server.setRequestHandler(ListToolsRequestSchema, handleListTools);
  
  // Register call tool handler
  server.setRequestHandler(CallToolRequestSchema, handleCallTool);
}

/**
 * Handle list tools request
 * @param {Object} request - The list tools request
 * @returns {Object} List of available tools
 */
async function handleListTools(request) {
  log(`Received list tools request: ${JSON.stringify(request)}`);
  return {
    tools: getRegisteredTools()
  };
}

/**
 * Handle call tool request
 * @param {Object} request - The call tool request
 * @returns {Object} Result of tool execution
 */
async function handleCallTool(request) {
  log(`Received call tool request: ${JSON.stringify(request)}`);
  
  if (!request.params) {
    return createErrorResponse('Missing parameters');
  }

  if (!request.params.arguments) {
    return createErrorResponse('Missing command arguments');
  }

  try {
    const tools = getRegisteredTools();
    const tool = tools.find(t => t.name === request.params.name);
    
    if (!tool) {
      return createErrorResponse(`Unknown tool: ${request.params.name}`);
    }
    
    const args = tool.parameters.parse(request.params.arguments);
    log(`Parsed tool arguments: ${JSON.stringify(args)}`);
    
    const result = await tool.execute(args);
    return result;
  } catch (error) {
    return createErrorResponse(error instanceof Error ? error.message : 'Unknown error occurred');
  }
}

/**
 * Create an error response
 * @param {string} message - Error message
 * @returns {Object} Formatted error response
 */
function createErrorResponse(message) {
  return {
    content: [{
      type: 'text',
      text: message
    }]
  };
}
