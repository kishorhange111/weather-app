const request = require("postman-request");

// Convert a city name into latitude/longitude with the OpenWeatherMap Geocoding API.
// The API key is read from the environment (see .env.example) - never hard-code secrets.
const geocode = (city, callback) => {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) {
    return callback("Server is missing OPENWEATHER_API_KEY.", undefined);
  }
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=3&appid=${key}`;
  request({ url, json: true }, (error, res, body) => {
    if (error) {
      callback("Unable to connect to location services!", undefined);
    } else if (!Array.isArray(body) || body.length === 0) {
      callback("Unable to find location. Try another search.", undefined);
    } else {
      callback(undefined, { lat: body[0].lat, lon: body[0].lon });
    }
  });
};

module.exports = geocode;
