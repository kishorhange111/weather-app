/**
 * @file Turn a city name into coordinates using the OpenWeatherMap Geocoding API.
 */
const request = require("postman-request");

/**
 * Look up the latitude/longitude of a city.
 *
 * Uses the Node "error-first callback" style: `callback(error, data)` where
 * exactly one of the two is set.
 *
 * The API key is read from the environment (see .env.example) - never
 * hard-code secrets in source files.
 *
 * @param {string} city - City name typed by the user, e.g. "Pune".
 * @param {(error: string|undefined, data?: {lat: number, lon: number}) => void} callback
 */
const geocode = (city, callback) => {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) {
    return callback("Server is missing OPENWEATHER_API_KEY.", undefined);
  }
  // encodeURIComponent escapes spaces and symbols ("New York" -> "New%20York")
  // so user input cannot break the URL.
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=3&appid=${key}`;
  // json: true makes the library parse the response body for us.
  request({ url, json: true }, (error, res, body) => {
    if (error) {
      // Network-level failure (offline, DNS, timeout).
      callback("Unable to connect to location services!", undefined);
    } else if (!Array.isArray(body) || body.length === 0) {
      // The API answers with an empty array when no city matches.
      callback("Unable to find location. Try another search.", undefined);
    } else {
      // Take the best (first) match.
      callback(undefined, { lat: body[0].lat, lon: body[0].lon });
    }
  });
};

module.exports = geocode;
