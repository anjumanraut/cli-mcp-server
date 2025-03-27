import { appendFile } from 'fs/promises';
import { join } from 'path';
import { EOL } from 'os';

const logFilePath = join(process.cwd(), 'logs', `cli-mcp-${new Date().toISOString().replace(/:/g, '-')}.log`);

export async function log(message) {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] ${message}${EOL}`;
  
  // Log to console for development
  console.error(logLine);
  
  try {
    await appendFile(logFilePath, logLine);
  } catch (error) {
    console.error(`Failed to write to log file: ${error.message}`);
  }
}
