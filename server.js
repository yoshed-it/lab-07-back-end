// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors'); //cross origin request sharing

// Application Setup
const PORT = process.env.PORT;
const app = express();
app.use(cors());

app.get('/location', searchToLatLong);
app.get('/weather', searchTimeForcast);



function searchToLatLong(request, response) {
  try {
    const rawGeoData = require('./data/geo.json');
    const location = new Location(request.query.data, rawGeoData);
    response.send(location);
  } catch (error) {
    handleError(error, response);
  }
}

function searchTimeForcast(request, response) {
  try {
    const rawWeatherData = require('./data/darksky.json');
    let daySummaries = rawWeatherData.daily.data.map((dayData) => {
      return new Weather(dayData);
    });

    response.send(daySummaries);
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


