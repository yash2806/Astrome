#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// ─── Configuration ────────────────────────────────────────────────────────────
const BASE_URL = "https://json.astrologyapi.com/v1";

// Reads API key from environment variables
const API_KEY = process.env.ASTROLOGY_API_KEY;

if (!API_KEY) {
  console.error(
    "❌ Missing API key. Set ASTROLOGY_API_KEY environment variable."
  );
  process.exit(1);
}

// ─── Helper: Call AstrologyAPI ─────────────────────────────────────────────
async function callAPI(endpoint, body = {}) {
  const url = `${BASE_URL}/${endpoint}`;
  const params = new URLSearchParams(body);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "x-astrologyapi-key": API_KEY,
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept-Language": "en",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error ${response.status}: ${error}`);
  }

  return response.json();
}

// ─── Common Input Schema (birth details) ──────────────────────────────────
const birthDetailsSchema = {
  day: z.number().int().min(1).max(31).describe("Day of birth (1-31)"),
  month: z.number().int().min(1).max(12).describe("Month of birth (1-12)"),
  year: z.number().int().describe("Year of birth (e.g. 1990)"),
  hour: z.number().int().min(0).max(23).describe("Hour of birth (0-23, 24hr format)"),
  min: z.number().int().min(0).max(59).describe("Minute of birth (0-59)"),
  lat: z.number().describe("Latitude of birth place (e.g. 17.38 for Hyderabad)"),
  lon: z.number().describe("Longitude of birth place (e.g. 78.46 for Hyderabad)"),
  tzone: z.number().describe("Timezone offset (e.g. 5.5 for IST)"),
};

// ─── Create MCP Server ────────────────────────────────────────────────────
const server = new McpServer({
  name: "astrology-api",
  version: "1.0.0",
});

// ──────────────────────────────────────────────────────────────────────────────
// TOOL 1: Birth Details
// ──────────────────────────────────────────────────────────────────────────────
server.tool(
  "get_birth_details",
  "Get basic birth details including ascendant, nakshatra, rashi (moon sign), and sunrise/sunset times",
  birthDetailsSchema,
  async (args) => {
    const data = await callAPI("birth_details", args);
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
  }
);

// ──────────────────────────────────────────────────────────────────────────────
// TOOL 2: Planet Positions
// ──────────────────────────────────────────────────────────────────────────────
server.tool(
  "get_planets",
  "Get all planetary positions (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu) for a birth chart",
  birthDetailsSchema,
  async (args) => {
    const data = await callAPI("planets", args);
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
  }
);

// ──────────────────────────────────────────────────────────────────────────────
// TOOL 3: Daily Nakshatra Prediction
// ──────────────────────────────────────────────────────────────────────────────
server.tool(
  "get_daily_nakshatra_prediction",
  "Get today's daily prediction based on the person's birth nakshatra covering personal life, profession, health, and emotions",
  birthDetailsSchema,
  async (args) => {
    const data = await callAPI("daily_nakshatra_prediction", args);
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
  }
);

// ──────────────────────────────────────────────────────────────────────────────
// TOOL 4: Panchang (Hindu Calendar)
// ──────────────────────────────────────────────────────────────────────────────
server.tool(
  "get_panchang",
  "Get today's Panchang including Tithi, Nakshatra, Yoga, Karana, and auspicious/inauspicious timings",
  {
    day: z.number().int().min(1).max(31).describe("Day (1-31)"),
    month: z.number().int().min(1).max(12).describe("Month (1-12)"),
    year: z.number().int().describe("Year"),
    hour: z.number().int().min(0).max(23).describe("Hour (0-23)"),
    min: z.number().int().min(0).max(59).describe("Minute (0-59)"),
    lat: z.number().describe("Latitude of location"),
    lon: z.number().describe("Longitude of location"),
    tzone: z.number().describe("Timezone offset"),
  },
  async (args) => {
    const data = await callAPI("basic_panchang", args);
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
  }
);

// ──────────────────────────────────────────────────────────────────────────────
// TOOL 5: Current Vimshottari Dasha
// ──────────────────────────────────────────────────────────────────────────────
server.tool(
  "get_current_dasha",
  "Get the current Vimshottari Dasha (planetary period) running for a person — shows the major, sub, and sub-sub dasha periods",
  birthDetailsSchema,
  async (args) => {
    const data = await callAPI("current_vdasha_all", args);
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
  }
);

// ──────────────────────────────────────────────────────────────────────────────
// TOOL 6: Manglik Check
// ──────────────────────────────────────────────────────────────────────────────
server.tool(
  "check_manglik",
  "Check if a person is Manglik (Mangal Dosha) — important in Hindu marriage compatibility",
  birthDetailsSchema,
  async (args) => {
    const data = await callAPI("manglik", args);
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
  }
);

// ──────────────────────────────────────────────────────────────────────────────
// TOOL 7: Kundli Match Making
// ──────────────────────────────────────────────────────────────────────────────
server.tool(
  "get_match_making_report",
  "Get a detailed Kundli match making / marriage compatibility report between two people",
  {
    // Boy's details
    m_day: z.number().int().describe("Boy's birth day"),
    m_month: z.number().int().describe("Boy's birth month"),
    m_year: z.number().int().describe("Boy's birth year"),
    m_hour: z.number().int().describe("Boy's birth hour"),
    m_min: z.number().int().describe("Boy's birth minute"),
    m_lat: z.number().describe("Boy's birth place latitude"),
    m_lon: z.number().describe("Boy's birth place longitude"),
    m_tzone: z.number().describe("Boy's timezone offset"),
    // Girl's details
    f_day: z.number().int().describe("Girl's birth day"),
    f_month: z.number().int().describe("Girl's birth month"),
    f_year: z.number().int().describe("Girl's birth year"),
    f_hour: z.number().int().describe("Girl's birth hour"),
    f_min: z.number().int().describe("Girl's birth minute"),
    f_lat: z.number().describe("Girl's birth place latitude"),
    f_lon: z.number().describe("Girl's birth place longitude"),
    f_tzone: z.number().describe("Girl's timezone offset"),
  },
  async (args) => {
    const data = await callAPI("match_making_report", args);
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
  }
);

// ──────────────────────────────────────────────────────────────────────────────
// TOOL 8: Numerology Report
// ──────────────────────────────────────────────────────────────────────────────
server.tool(
  "get_numerology_report",
  "Get a full numerology report including life path number, destiny number, lucky numbers, and personality insights",
  {
    ...birthDetailsSchema,
    name: z.string().describe("Full name of the person"),
  },
  async (args) => {
    const data = await callAPI("numero_report", args);
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
  }
);

// ──────────────────────────────────────────────────────────────────────────────
// TOOL 9: Gem Stone Suggestion
// ──────────────────────────────────────────────────────────────────────────────
server.tool(
  "get_gem_suggestion",
  "Get personalized gemstone recommendations based on the birth chart",
  birthDetailsSchema,
  async (args) => {
    const data = await callAPI("basic_gem_suggestion", args);
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
  }
);

// ──────────────────────────────────────────────────────────────────────────────
// TOOL 10: Kalsarpa Dosha
// ──────────────────────────────────────────────────────────────────────────────
server.tool(
  "check_kalsarpa_dosha",
  "Check if a person has Kalsarpa Dosha in their birth chart and get details about its type and effects",
  birthDetailsSchema,
  async (args) => {
    const data = await callAPI("kalsarpa_details", args);
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
  }
);

// ─── Start Server ─────────────────────────────────────────────────────────────
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("🔮 Astrology MCP Server running...");








// What was built
// 10 MCP tools wrapping the AstrologyAPI:
// Tool
// What it does
// get_birth_details    Ascendant, Nakshatra, Rashi
// get_planets          All planetary positions
// get_daily_nakshatra_prediction       Today's personal 
// predictionget_panchang       Daily Tithi, Yoga, Muhurtas
// get_current_dasha        Active Vimshottari Dasha 
// periodcheck_manglik      Mangal Dosha 
// checkget_match_making_reportKundli compatibility for two people
// get_numerology_report        Life path, destiny number
// get_gem_suggestion       Gemstone recommendations
// check_kalsarpa_dosha     Kalsarpa Dosha check