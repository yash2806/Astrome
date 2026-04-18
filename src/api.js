import { BASE_URL, API_KEY } from "./config.js";

export async function callAstrologyAPI(endpoint, body = {}) {
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