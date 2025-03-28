import { appendFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { EOL } from 'os';
import { existsSync } from 'fs';

const LOG_DIR = join(process.cwd(), 'logs');
const logFilePath = join(LOG_DIR, `cli-mcp-${new Date().toISOString().replace(/:/g, '-')}.log`);

// Ensure log directory exists
async function ensureLogDirectory() {
  if (!existsSync(LOG_DIR)) {
    await mkdir(LOG_DIR, { recursive: true });
  }
}

/**
 * Log a message to console and to a file
 * @param {string} message - The message to log
 */
export async function log(message) {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] ${message}${EOL}`;
  
  // Log to console for development
  console.error(logLine);
  
  try {
    await ensureLogDirectory();
    await appendFile(logFilePath, logLine);
  } catch (error) {
    console.error(`Failed to write to log file: ${error.message}`);
  }
}
