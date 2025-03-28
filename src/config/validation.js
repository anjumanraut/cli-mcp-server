import { log } from '../utils/logging.js';
import { existsSync } from 'fs';

/**
 * Validate that paths exist
 * @param {string[]} paths - Array of paths to validate
 */
export function validatePaths(paths) {
  // Check if paths exist
  const invalidPaths = paths.filter(path => !existsSync(path));
  if (invalidPaths.length > 0) {
    log(`Warning: The following paths do not exist: ${invalidPaths.join(', ')}`);
  }
}

/**
 * Check if a given path is allowed based on configured allowed paths
 * @param {string} path - Path to check
 * @param {string[]} allowedPaths - Array of allowed paths
 * @returns {boolean} Whether the path is allowed
 */
export function isPathAllowed(path, allowedPaths) {
  if (!allowedPaths || allowedPaths.length === 0) {
    log('No allowed paths configured');
    return false;
  }

  const normalizedPath = path.replace(/\\/g, '/');
  const isAllowed = allowedPaths.some(allowedPath => 
    normalizedPath.startsWith(allowedPath.replace(/\\/g, '/'))
  );

  if (!isAllowed) {
    log(`Path not allowed: ${path}`);
    log(`Allowed paths: ${JSON.stringify(allowedPaths)}`);
  }
  
  return isAllowed;
}
