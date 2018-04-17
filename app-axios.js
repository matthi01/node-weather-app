
/*
  some ideas to keep this going...
   - include a command to set a default location
     (could store this in a json file)
   - add some more things to the output
*/

const yargs = require('yargs');
const axios = require('axios');
const geocode = require('./geocode/geocode');
const weather = require('./weather/weather');

const argv = yargs
  .options({
    a: {
      demand: true,
      alias: 'address',
      describe: 'Get weather for this address',
      string: true
    }
  })
  .help()
  .alias('help', 'h')
  .argv;

const encodedAddress = encodeURIComponent(argv.address);
const geocodeApiKey = 'AIzaSyCsXZCqkk5Yy_39nIXiZx5IuDS0vji6qGw';
const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${geocodeApiKey}`;

axios.get(geocodeUrl)
  .then((response) => {
    // no results for the given address still resolves the promise
    if (response.data.status === 'ZERO_RESULTS') {
      throw new Error('Unable to find address.');
    }

    const darkSkyApiKey = '825c2d78e3414061da3e3a0ed022cb73';
    const lat = response.data.results[0].geometry.location.lat;
    const lng = response.data.results[0].geometry.location.lng;
    const weatherUrl = `https://api.darksky.net/forecast/${darkSkyApiKey}/${lat},${lng}?units=si`;

    console.log(response.data.results[0].formatted_address);
    return axios.get(weatherUrl);
  })
  .then((response) => {
    let temperature = response.data.currently.temperature;
    let apparentTemperature = response.data.currently.apparentTemperature;
    console.log(`Current: ${temperature} Celsius \nFeels Like: ${apparentTemperature} Celsius`);
  })
  .catch((err) => {
    if (err.code === 'ENOTFOUND') {
      console.log('Unable to connect to API server.');
    } else {
      console.log(err.message);
    }
  });
