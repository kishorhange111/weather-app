const request = require("postman-request");

// Current weather for a latitude/longitude from the Weatherstack API.
// The API key is read from the environment (see .env.example) - never hard-code secrets.
const forecast = ({ lat, lon }, callback) => {
  const key = process.env.WEATHERSTACK_API_KEY;
  if (!key) {
    return callback("Server is missing WEATHERSTACK_API_KEY.", undefined);
  }
  const url = `http://api.weatherstack.com/current?access_key=${key}&query=${lat},${lon}`;
  request({ url, json: true }, (error, res, body) => {
    if (error) {
      callback("Unable to connect to weather service!", undefined);
    } else if (body.error) {
      callback("Unable to find location", undefined);
    } else {
      callback(undefined, body);
    }
  });
};

module.exports = forecast;
