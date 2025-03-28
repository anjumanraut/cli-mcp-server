# CLI MCP Server

This repository contains a Model Context Protocol (MCP) server implementation for terminal commands. It allows MCP-compatible AI assistants to execute terminal commands in specified directories.

## About the Model Context Protocol (MCP)

The Model Context Protocol (MCP) is an open standard developed by Anthropic that enables secure, two-way connections between data sources and AI-powered tools. MCP servers expose data and functionality to AI applications, allowing AI models to intelligently retrieve, process, and leverage information across private data sources.

## Project Structure

```
/cli-mcp-server
├── config/                     # Configuration-related files
│   ├── index.js                # Main config exporter
│   └── validation.js           # Configuration validation logic
├── src/
│   ├── core/                   # Core server functionality
│   │   ├── server.js           # Server initialization & management
│   │   └── handlers.js         # MCP request handlers
│   ├── tools/                  # Tool implementations
│   │   ├── index.js            # Exports all tools
│   │   └── terminal/           # Terminal tool module
│   │       ├── index.js        # Main terminal tool export
│   │       ├── schema.js       # Terminal tool schema
│   │       ├── executor.js     # Command execution logic
│   │       └── worker.js       # Terminal worker implementation
│   ├── utils/                  # Utility functions
│   │   ├── logging.js          # Logging utilities
│   │   └── error.js            # Error handling utilities
│   └── index.js                # Application entry point
├── tests/                      # Test directory
│   └── config.test.js          # Configuration tests
├── logs/                       # Log output directory
├── scripts/                    # Scripts for running/building
│   ├── start-server.sh         # Unix start script
│   └── start-server.bat        # Windows start script
├── package.json                # Project metadata and dependencies
└── README.md                   # Project documentation
```

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

   On macOS/Linux:

   ```bash
   ./start-server.sh [allowed-path-1] [allowed-path-2] ...
   ```

   On Windows:

   ```bash
   start-server.bat [allowed-path-1] [allowed-path-2] ...
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

For Windows, use the batch file instead:

```json
{
  "mcpServers": {
    "terminal": {
      "command": "C:\\path\\to\\cli-mcp-server\\start-server.bat",
      "args": [
        "C:\\path\\to\\allowed\\directory1",
        "C:\\path\\to\\allowed\\directory2",
        "C:\\path\\to\\allowed\\directory3"
      ]
    }
  }
}
```

## Usage

Once configured, Claude can execute terminal commands in the specified directories through the CLI MCP server.

Example usage in Claude:

```
Please run the following command:
terminal("ls -la", "/path/to/allowed/directory1")
```

On Windows, you might use:

```
Please run the following command:
terminal("dir", "C:\\path\\to\\allowed\\directory1")
```

## Development

### Available Scripts

- `npm start` - Run the server
- `npm run dev` - Run the server with auto-reload on file changes
- `npm test` - Run the test suite

## Security Considerations

- The server only allows terminal commands to be executed in directories specified as command-line arguments.
- Be cautious about the directories you expose to Claude, as it will have access to execute commands in these locations.
- Consider using a dedicated user with limited permissions for running the server.
- Review the commands executed by Claude to ensure they are safe and appropriate.
- The server includes path validation to prevent access to unauthorized directories.

## License

[MIT License](LICENSE)
