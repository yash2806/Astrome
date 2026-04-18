#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTools } from "./tools.js";

// 1. Initialize Server
const server = new McpServer({
  name: "astrology-api",
  version: "1.0.0",
});

// 2. Register all tools
registerTools(server);

// 3. Connect Transport
const transport = new StdioServerTransport();
await server.connect(transport);

console.error("🔮 Astrology MCP Server running...");