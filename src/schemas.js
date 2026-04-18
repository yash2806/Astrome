import { z } from "zod";

export const birthDetailsSchema = {
  day: z.number().int().min(1).max(31).describe("Day of birth (1-31)"),
  month: z.number().int().min(1).max(12).describe("Month of birth (1-12)"),
  year: z.number().int().describe("Year of birth (e.g. 1990)"),
  hour: z.number().int().min(0).max(23).describe("Hour of birth (0-23, 24hr format)"),
  min: z.number().int().min(0).max(59).describe("Minute of birth (0-59)"),
  lat: z.number().describe("Latitude of birth place (e.g. 17.38 for Hyderabad)"),
  lon: z.number().describe("Longitude of birth place (e.g. 78.46 for Hyderabad)"),
  tzone: z.number().describe("Timezone offset (e.g. 5.5 for IST)"),
};