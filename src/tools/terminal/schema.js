import { z } from 'zod';

/**
 * Schema for terminal tool parameters
 */
export const TerminalParametersSchema = z.object({
  command: z.string().describe('Terminal command to execute'),
  workingDir: z.string().describe('Working directory for command execution')
});
