import { commandTool } from './command/index.js';

/**
 * Get all registered tools
 * @returns {Array} Array of tool implementations
 */
export function getRegisteredTools() {
  return [
    commandTool
  ];
}
