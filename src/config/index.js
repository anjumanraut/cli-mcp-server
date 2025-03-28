import { validatePaths, isPathAllowed } from './validation.js';
import { log } from '../utils/logging.js';

// Configuration state
let config = {
  allowedPaths: []
};

/**
 * Load configuration from command line arguments
 * @returns {Object} Configuration object
 */
export async function loadConfig() {
  try {
    // Get paths from command line arguments (skip the first two which are node and script path)
    const pathArgs = process.argv.slice(2);
    
    if (pathArgs.length === 0) {
      log('Warning: No path arguments provided. Only the current directory will be allowed.');
      // If no paths are provided, just allow the current directory
      config.allowedPaths = [process.cwd()];
    } else {
      config.allowedPaths = pathArgs;
      log(`Loaded ${config.allowedPaths.length} allowed paths from command line arguments`);
      config.allowedPaths.forEach(path => log(`Allowed path: ${path}`));
    }
    
    // Validate the paths
    validatePaths(config.allowedPaths);
    
    return config;
  } catch (error) {
    log(`Failed to load config: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

/**
 * Get current configuration
 * @returns {Object} Configuration object
 */
export function getConfig() {
  return config;
}

/**
 * Check if a path is allowed
 * @param {string} path - Path to check
 * @returns {boolean} Whether the path is allowed
 */
export function checkPathAllowed(path) {
  return isPathAllowed(path, config.allowedPaths);
}
