const request = require('request');

const darkSkyApiKey = '825c2d78e3414061da3e3a0ed022cb73';

const getWeather = (lat, lng, callback) => {
  // request takes an object of parameters and a callback func
  // returns error, response, body
  request(
    {url: `https://api.darksky.net/forecast/${darkSkyApiKey}/${lat},${lng}?units=si`, json: true},
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        callback(undefined, {
          temperature: body.currently.temperature,
          apparentTemperature: body.currently.apparentTemperature
        });
      } else {
        callback('Unable to fetch weather.', undefined);
      }
    }
  );
};

module.exports.getWeather = getWeather;
