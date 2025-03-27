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
./start-server.sh
```

### Configuration

To use this server with Claude, you need to update your Claude configuration to include the CLI MCP server.

Update your Claude configuration file (typically located at `~/.config/claude/claude_desktop_config.json` or similar) to include the following:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/path/to/directory1",
        "/path/to/directory2",
        "/path/to/directory3"
      ]
    },
    "terminal": {
      "command": "/path/to/cli-mcp-server/start-server.sh",
      "args": []
    }
  }
}
```

Replace `/path/to/directory1`, `/path/to/directory2`, etc. with the directories you want to make accessible to Claude.

Replace `/path/to/cli-mcp-server` with the actual path where this repository is located.

## Usage

Once configured, Claude can execute terminal commands in the specified directories through the CLI MCP server.

## Security Considerations

- By default, the server only allows terminal commands to be executed in directories specified in the `cli-tool.json` file.
- Be cautious about the directories you expose to Claude, as it will have access to execute commands in these locations.
- Consider using a dedicated user with limited permissions for running the server.
- Review the commands executed by Claude to ensure they are safe and appropriate.

## License

[MIT License](LICENSE)
