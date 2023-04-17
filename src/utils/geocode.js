const request = require("postman-request");

const getWeather = (city, callback) => {
  const geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=3&appid=80a55ada27a34a72b53c84d05b28face`;
  request({ url: geoURL, json: true }, (e, res, body) => {
    if (e) {
      callback("Unable to connect to location services!", undefined);
    } else if (body.length === 0 || body.message === "Nothing to geocode") {
      callback("Unable to find location. Try another search.", undefined);
    } else {
      const data = {
        lat: body[0].lat,
        lon: body[0].lon,
      };
      callback(undefined, data);
    }
  });
};
module.exports = getWeather;
