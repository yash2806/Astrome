export const BASE_URL = "https://json.astrologyapi.com/v1";

// Safely read from the environment
export const API_KEY = process.env.ASTROLOGY_API_KEY;

if (!API_KEY) {
  console.error("❌ Missing API key. Set ASTROLOGY_API_KEY environment variable.");
  process.exit(1);
}