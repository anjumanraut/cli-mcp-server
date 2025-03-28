import { z } from 'zod';

/**
 * Command descriptions for reuse
 */
export const COMMAND_DESCRIPTIONS = {
  command: 'Command to execute',
  workingDir: 'Working directory for command execution'
};

/**
 * Schema for command tool parameters
 */
export const CommandParametersSchema = z.object({
  command: z.string().describe(COMMAND_DESCRIPTIONS.command),
  workingDir: z.string().describe(COMMAND_DESCRIPTIONS.workingDir)
});
