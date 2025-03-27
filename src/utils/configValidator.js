import { log } from './simpleLog.js';

let allowedPaths = [];

export async function loadConfig() {
  try {
    // Get paths from command line arguments (skip the first two which are node and script path)
    const pathArgs = process.argv.slice(2);
    
    if (pathArgs.length === 0) {
      log('Warning: No path arguments provided. Only the current directory will be allowed.');
      // If no paths are provided, just allow the current directory
      allowedPaths = [process.cwd()];
    } else {
      allowedPaths = pathArgs;
      log(`Loaded ${allowedPaths.length} allowed paths from command line arguments`);
      allowedPaths.forEach(path => log(`Allowed path: ${path}`));
    }
  } catch (error) {
    log(`Failed to load config: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

export function isPathAllowed(path) {
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
