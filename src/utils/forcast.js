const request = require("postman-request");

const forcast = (data, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=e6f12bbcd88d3696b56112f19cfaf5aa&query=${data.lat},${data.lon}`;
  request({ url, json: true }, (e, res, body) => {
    if (e) {
      callback("Unable to connect to weather service!", undefined);
    } else if (body.error) {
      callback("Unable to find location", undefined);
    } else {
      callback(undefined, body);
    }
  });
};

module.exports = forcast;
