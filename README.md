# Astrome - Astrology API MCP Server

An MCP (Model Context Protocol) server that integrates the Astrology API with Claude and other AI assistants, providing access to comprehensive astrological calculations and predictions.

## Overview

Astrome is a bridge between the [Astrology API](https://www.astrologyapi.com/) and Claude, enabling AI assistants to:
- Calculate birth charts and planetary positions
- Generate astrological predictions and reports
- Perform compatibility matching and relationship analysis
- Provide numerology insights and gemstone recommendations
- Check astrological doshas (afflictions)
- Access daily Panchang (Hindu calendar) information

## Features

### Available Tools

1. **get_birth_details** - Get basic birth details including ascendant, nakshatra, rashi (moon sign), and sunrise/sunset times
2. **get_planets** - Retrieve all planetary positions for a birth chart
3. **get_daily_nakshatra_prediction** - Get daily predictions based on birth nakshatra
4. **get_panchang** - Access today's Panchang (Tithi, Nakshatra, Yoga, Karana)
5. **get_current_dasha** - Calculate the current Vimshottari Dasha (planetary period)
6. **check_manglik** - Determine if a person has Mangal Dosha
7. **get_match_making_report** - Generate Kundli compatibility reports between two people
8. **get_numerology_report** - Provide numerology analysis including life path number
9. **get_gem_suggestion** - Get personalized gemstone recommendations
10. **check_kalsarpa_dosha** - Check for Kalsarpa Dosha in birth charts

## Installation

### Prerequisites

- Node.js 18+
- An Astrology API account with an API key (get it from [astrologyapi.com](https://www.astrologyapi.com/))

### Setup

1. Clone the repository:
```bash
git clone <repo-url>
cd astrome
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
```bash
export ASTROLOGY_API_KEY="your_api_key_here"
```

Or create a `.env` file (add to `.gitignore`):
```
ASTROLOGY_API_KEY=your_api_key_here
```

## Configuration

The server configuration is managed in `src/config.js`:

```javascript
export const BASE_URL = "https://json.astrologyapi.com/v1";
export const API_KEY = process.env.ASTROLOGY_API_KEY;
```

## Running the Server

### Direct Execution
```bash
node astrome.js
```

### With Claude (via Claude Desktop)

Add to your Claude Desktop configuration (`~/.config/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "astrome": {
      "command": "node",
      "args": ["/path/to/Astrome/src/index.js"],
      "env": {
        "ASTROLOGY_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

Then restart Claude Desktop to load the new MCP server.

## Usage Examples

Once connected to Claude, you can ask queries like:

- "What's my birth chart for someone born on January 15, 1990 at 14:30 in New York?"
- "Are these two people compatible for marriage? [provide birth details]"
- "What gemstones should I wear based on my birth chart?"
- "Check if I have any doshas in my birth chart"
- "What's today's Panchang?"

## Project Structure

```
astrome/
├── package.json            # Dependencies
├── .gitignore             # Git ignore rules
├── README.md              # This file
└── src/
    ├── index.js           # Server initialization
    ├── api.js             # API communication utilities
    ├── config.js          # Configuration and environment setup
    ├── schemas.js         # Zod schemas for input validation
    └── tools.js           # Tool definitions and handlers
```

## Development

### Understanding the Code Structure

- **astrome.js** - Legacy all-in-one implementation
- **src/index.js** - Modular server entry point
- **src/config.js** - Centralized configuration
- **src/api.js** - API request handler
- **src/schemas.js** - Input validation schemas using Zod
- **src/tools.js** - Tool registration and handlers

### Adding New Tools

1. Define the schema in `src/schemas.js`
2. Add the tool handler in `src/tools.js`
3. Call the appropriate Astrology API endpoint via `callAstrologyAPI()`

Example:
```javascript
server.tool(
  "my_new_tool",
  "Description of what the tool does",
  mySchema,
  async (args) => {
    const data = await callAstrologyAPI("endpoint_name", args);
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);
```

## API Requirements

All tools require the following birth details:
- **day**: Day of birth (1-31)
- **month**: Month of birth (1-12)
- **year**: Year of birth
- **hour**: Hour of birth in 24-hour format (0-23)
- **min**: Minute of birth (0-59)
- **lat**: Latitude of birth location
- **lon**: Longitude of birth location
- **tzone**: Timezone offset (e.g., +5.5 for IST, -5 for EST)

## Error Handling

The server validates inputs using Zod schemas and provides clear error messages. API errors from the Astrology API are propagated with status codes and error details.

## Security

- Never commit your API key to version control
- Use environment variables to manage sensitive credentials
- The `.gitignore` file is configured to exclude `.env` files

## Troubleshooting

### Missing API Key Error
```
❌ Missing API key. Set ASTROLOGY_API_KEY environment variable.
```
Solution: Ensure `ASTROLOGY_API_KEY` is set in your environment.

### API Connection Issues
- Verify your API key is valid
- Check your internet connection
- Ensure the Astrology API service is operational

### Claude Not Finding the Server
- Verify the command path is correct in `claude_desktop_config.json`
- Check that Node.js is in your PATH
- Restart Claude Desktop after making configuration changes

## License

MIT License

## Support

For issues with the Astrology API, visit [astrologyapi.com](https://www.astrologyapi.com/)

For MCP (Model Context Protocol) documentation, see the [official MCP documentation](https://modelcontextprotocol.io/)
