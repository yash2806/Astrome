import { z } from "zod";
import { callAstrologyAPI } from "./api.js";
import { birthDetailsSchema } from "./schemas.js";

export function registerTools(server) {
  server.tool(
    "get_birth_details",
    "Get basic birth details including ascendant, nakshatra, rashi (moon sign), and sunrise/sunset times",
    birthDetailsSchema,
    async (args) => {
      const data = await callAstrologyAPI("birth_details", args);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    "get_planets",
    "Get all planetary positions for a birth chart",
    birthDetailsSchema,
    async (args) => {
      const data = await callAstrologyAPI("planets", args);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    "get_daily_nakshatra_prediction",
    "Get today's daily prediction based on birth nakshatra",
    birthDetailsSchema,
    async (args) => {
      const data = await callAstrologyAPI("daily_nakshatra_prediction", args);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    "get_panchang",
    "Get today's Panchang including Tithi, Nakshatra, Yoga, Karana",
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
      const data = await callAstrologyAPI("basic_panchang", args);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    "get_current_dasha",
    "Get the current Vimshottari Dasha (planetary period) running for a person",
    birthDetailsSchema,
    async (args) => {
      const data = await callAstrologyAPI("current_vdasha_all", args);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    "check_manglik",
    "Check if a person is Manglik (Mangal Dosha)",
    birthDetailsSchema,
    async (args) => {
      const data = await callAstrologyAPI("manglik", args);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    "get_match_making_report",
    "Get a detailed Kundli match making compatibility report between two people",
    {
      m_day: z.number().int().describe("Boy's birth day"),
      m_month: z.number().int().describe("Boy's birth month"),
      m_year: z.number().int().describe("Boy's birth year"),
      m_hour: z.number().int().describe("Boy's birth hour"),
      m_min: z.number().int().describe("Boy's birth minute"),
      m_lat: z.number().describe("Boy's birth place latitude"),
      m_lon: z.number().describe("Boy's birth place longitude"),
      m_tzone: z.number().describe("Boy's timezone offset"),
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
      const data = await callAstrologyAPI("match_making_report", args);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    "get_numerology_report",
    "Get a full numerology report including life path number and personality insights",
    {
      ...birthDetailsSchema,
      name: z.string().describe("Full name of the person"),
    },
    async (args) => {
      const data = await callAstrologyAPI("numero_report", args);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    "get_gem_suggestion",
    "Get personalized gemstone recommendations based on the birth chart",
    birthDetailsSchema,
    async (args) => {
      const data = await callAstrologyAPI("basic_gem_suggestion", args);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    "check_kalsarpa_dosha",
    "Check if a person has Kalsarpa Dosha in their birth chart",
    birthDetailsSchema,
    async (args) => {
      const data = await callAstrologyAPI("kalsarpa_details", args);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );
}