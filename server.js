// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors'); //cross origin request sharing

// Application Setup
const PORT = process.env.PORT;
const app = express();
app.use(cors());

app.get('/location', (request, response) =>{

  const locationData = searchToLatLong(request.query.data);
  response.send(locationData);
  try {
    const locationData = require('./data/geo.json');
    response.send(locationData);
  } catch (error) {
    handleError(error, response);
  }
});

app.get('/weather', (request, response) =>{ 

  const weatherData = searchTimeForcast(request.query.data);
  response.send(weatherData);
  try {
    const weatherData = require('./data/darksky.json');
    response.send(weatherData);
  } catch (error) {
    handleError(error, response);
    
  }
  
});

function handleError(error, response){
  console.error(error);
  response.status(500).send('Nope!');
}

function searchToLatLong(query) {
  const geoData = require('./data/geo.json');
  console.log(geoData);
  const location = new Location(query, geoData);
  return location;
}


function searchTimeForcast(query) {
  const weatherData = require('./data/darksky.json');
  const weather = new Weather(query, weatherData);
  console.log( weather);
  return weather;
}

function Location(query, geoData){
  this.search_query = query;
  this.formated_query = geoData.results[0].formatted_address;
  this.latitude = geoData.results[0].geometry.location.lat;
  this.longitude = geoData.results[0].geometry.location.lng;
}
function Weather(query, weatherData){
  this.search_query = query;
  this.time = weatherData.daily.data[0].time;
  this.forcast = weatherData.daily.data[0].summary;
}




app.listen(PORT, () => console.log(`App is listening on ${PORT}`) );


