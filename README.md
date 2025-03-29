# Command

This repository contains a Model Context Protocol (MCP) server implementation for executing commands. It allows MCP-compatible AI assistants to execute commands in specified directories.

## About the Model Context Protocol (MCP)

The Model Context Protocol (MCP) is an open standard developed by Anthropic that enables secure, two-way connections between data sources and AI-powered tools. MCP servers expose data and functionality to AI applications, allowing AI models to intelligently retrieve, process, and leverage information across private data sources.

## Project Structure

```
/command
├── config/                     # Configuration-related files
│   ├── index.js                # Main config exporter
│   └── validation.js           # Configuration validation logic
├── src/
│   ├── core/                   # Core server functionality
│   │   ├── server.js           # Server initialization & management
│   │   └── handlers.js         # MCP request handlers
│   ├── tools/                  # Tool implementations
│   │   ├── index.js            # Exports all tools
│   │   └── command/            # Command tool module
│   │       ├── index.js        # Main command tool export
│   │       ├── schema.js       # Command tool schema
│   │       ├── executor.js     # Command execution logic
│   │       └── worker.js       # Command worker implementation
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

### Configuration

To use this server with Claude, you need to update your Claude configuration to include the Command server.

Update your Claude configuration file (typically located at `~/.config/claude/claude_desktop_config.json` or `~/Library/Application Support/Claude/claude_desktop_config.json`) to include the following:

```json
{
  "mcpServers": {
    "command": {
      "command": "/path/to/command/start-server.sh",
      "args": [
        "/path/to/allowed/directory1",
        "/path/to/allowed/directory2",
        "/path/to/allowed/directory3"
      ]
    }
  }
}
```

Replace `/path/to/command` with the actual path where this repository is located.

Replace `/path/to/allowed/directory1`, `/path/to/allowed/directory2`, etc. with the directories you want to allow Claude to execute commands in.

For Windows, use the batch file instead:

```json
{
  "mcpServers": {
    "command": {
      "command": "C:\\path\\to\\command\\start-server.bat",
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

Once configured, Claude can execute commands in the specified directories through the CLI MCP server.

The server accepts directory paths as arguments. Only these directories will be accessible for command execution.

Example usage in Claude:

```
Please run the following command:
command("ls -la", "/path/to/allowed/directory1")
```

On Windows, you might use:

```
Please run the following command:
command("dir", "C:\\path\\to\\allowed\\directory1")
```

## Development

### Available Scripts

- `npm start` - Run the server
- `npm run dev` - Run the server with auto-reload on file changes
- `npm test` - Run the test suite

## Security Considerations

- The server only allows commands to be executed in directories specified as command-line arguments.
- Be cautious about the directories you expose to Claude, as it will have access to execute commands in these locations.
- Consider using a dedicated user with limited permissions for running the server.
- Review the commands executed by Claude to ensure they are safe and appropriate.
- The server includes path validation to prevent access to unauthorized directories.

## License

[MIT License](LICENSE)
