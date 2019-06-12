// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors'); //cross origin request sharing

// Application Setup
const PORT = process.env.PORT;
const app = express();
const superagent = require('superagent');
app.use(cors());

app.get('/location', searchToLatLong);
app.get('/weather', searchTimeForcast);



function searchToLatLong(request, response) {
  try {

    const URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${request.query.data}&key=${process.env.GEO_API_KEY}`;

    return superagent.get(URL)

      .then(geoResponse => {
        const location = new Location(request.query.data, geoResponse.body);
        response.send(location);
      })
      .catch(error => {
        handleError(error, response);
      });
  }
  catch (error) {

    handleError(error, response);
  }
}

function searchTimeForcast(request, response) {
  try {

    const URL = `https://api.darksky.net/forecast/${process.env.DARK_SKY_API}/${location.latitude},${location.longitude}`;

    return superagent.get(URL)
      .then(weatherResponse => {
        const weather = new Weather(request.query.data, weatherResponse.body);
        console.log(weather);
        response.send(weather);
      });


  } catch (error) {
    handleError(error, response);

  }

}


function Location(query, geoData) {
  this.search_query = query;
  this.formated_query = geoData.results[0].formatted_address;
  this.latitude = geoData.results[0].geometry.location.lat;
  this.longitude = geoData.results[0].geometry.location.lng;
}
function Weather(dayData) {

  this.time = new Date(dayData.time * 1000).toString().slice(0, 15);
  this.forcast = dayData.summary;
}
function handleError(error, response) {
  console.error(error);
  response.status(500).send('Nope!');
}




app.listen(PORT, () => console.log(`App is listening on ${PORT}`));


