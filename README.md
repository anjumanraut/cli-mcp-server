# CLI MCP Server

This repository contains a simplified Model Context Protocol (MCP) server implementation for terminal commands.

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)

### Local Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
./start-server.sh [allowed-path-1] [allowed-path-2] ...
```

The server accepts directory paths as arguments. Only these directories will be accessible for terminal commands.

### Configuration

To use this server with Claude, you need to update your Claude configuration to include the CLI MCP server.

Update your Claude configuration file (typically located at `~/.config/claude/claude_desktop_config.json` or `~/Library/Application Support/Claude/claude_desktop_config.json`) to include the following:

```json
{
  "mcpServers": {
    "terminal": {
      "command": "/path/to/cli-mcp-server/start-server.sh",
      "args": [
        "/path/to/allowed/directory1",
        "/path/to/allowed/directory2",
        "/path/to/allowed/directory3"
      ]
    }
  }
}
```

Replace `/path/to/cli-mcp-server` with the actual path where this repository is located.

Replace `/path/to/allowed/directory1`, `/path/to/allowed/directory2`, etc. with the directories you want to allow Claude to execute terminal commands in.

## Usage

Once configured, Claude can execute terminal commands in the specified directories through the CLI MCP server.

Example usage in Claude:
```
Please run the following command:
terminal("ls -la", "/path/to/allowed/directory1")
```

## Security Considerations

- The server only allows terminal commands to be executed in directories specified as command-line arguments.
- Be cautious about the directories you expose to Claude, as it will have access to execute commands in these locations.
- Consider using a dedicated user with limited permissions for running the server.
- Review the commands executed by Claude to ensure they are safe and appropriate.

## License

[MIT License](LICENSE)
