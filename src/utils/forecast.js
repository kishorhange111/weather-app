/**
 * @file Fetch the current weather for a set of coordinates from the Weatherstack API.
 */
const request = require("postman-request");

/**
 * Get current weather conditions for a latitude/longitude.
 *
 * Error-first callback: `callback(error, body)`. On success `body` is the
 * raw Weatherstack response (`body.location`, `body.current`, ...), which the
 * browser code reads directly.
 *
 * The API key is read from the environment (see .env.example) - never
 * hard-code secrets in source files.
 *
 * @param {{lat: number, lon: number}} coords - Coordinates from geocode().
 * @param {(error: string|undefined, body?: object) => void} callback
 */
const forecast = ({ lat, lon }, callback) => {
  const key = process.env.WEATHERSTACK_API_KEY;
  if (!key) {
    return callback("Server is missing WEATHERSTACK_API_KEY.", undefined);
  }
  const url = `http://api.weatherstack.com/current?access_key=${key}&query=${lat},${lon}`;
  request({ url, json: true }, (error, res, body) => {
    if (error) {
      // Network-level failure (offline, DNS, timeout).
      callback("Unable to connect to weather service!", undefined);
    } else if (body.error) {
      // Weatherstack reports problems (bad key, bad query) inside the body
      // with HTTP 200, so the body has to be checked explicitly.
      callback("Unable to find location", undefined);
    } else {
      callback(undefined, body);
    }
  });
};

module.exports = forecast;
