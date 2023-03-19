import React, { Component } from 'react';
import { MapContainer, GeoJSON } from 'react-leaflet';

import countries from './../data/countries.json';
import airports from './../data/airports.json';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import './MyMap.css';
var tempColor01 = 'rgb(212, 21, 21)'; //red
var tempColor02 = 'rgb(21, 212, 31)'; //green
var tempColor03 = 'rgb(21, 53, 212)'; //blue
var countryColor;


class MyMap extends Component {
  state = {};

  componentDidMount() {
    console.log(airports);
  }

  countryStyle = {
    //rgb(129, 235, 180)'

    fillColor: 'rgb(129, 235, 180)',
    fillOpacity: 1,
    color: 'rgb(41, 153, 95)',
    weight: 1,
  };

  //pop ups when clicking on each country
  //TO DO: change to onEachAirport to give weather
  onEachCountry = (country, layer) => {
    //const countryName = country.properties.ADMIN;

    //layer represents the drawing of the country that we see on the screen
    //layer.bindPopup(countryName);
    layer.addEventListener('click', function (e) {
      //changing colour the line below changes the colour of the country
      //context of this function needs to be changed - colour of country she be difference for each day/ should be updated via data pulled from the api
      //currently changes colour when country is clicked
      layer.setStyle({ fillColor: countryColor });
    });
  };

  changeIcon = (latlng) => {
    //override leaflet's default marker with a circleMarker object
    var x = latlng.geometry.coordinates[1];
    var y = latlng.geometry.coordinates[0];
    return L.circleMarker([x, y], {
      fillColor: '#000000',
      radius: 3,
      weight: 5,
      color: '#000000',
    });
  };

  onEachPoint = (point, layer) => {
    //this part should be used when the user clicks on a point
    //place holder code gives popup with port name
    //some airports have no name for name_en etc and some are fully in different alphabets
    var portName = point.properties.name_en;
    if (portName == null) {
      portName = point.properties.name;
    }

    layer.addEventListener('click', async function (e) {
      var x = point.geometry.coordinates[1];
      var y = point.geometry.coordinates[0];

      var data = await weatherAPI(x, y);

      console.log(data);

      //   layer.bindPopup(portName);
      layer.bindPopup(`
      <div class = "popUp">


      <p> ${portName} </p> 
      <p> temp: ${data.temp} °C</p> 
      <p> pressure: ${data.pressure} KPa</p> 
      <p> humidity: ${data.humidity} %</p> 
      <p> visibility: ${data.visibility} m</p> 
      <p> windSpeed: ${data.windSpeed} m/s</p> 
      <p> windDeg: ${data.windDeg} °</p> 


      </div>
      `);
    });
    //console.log(layer)
  };

  //RENDERING MAP USING GEOJSON AND MAP COMPONENT
  render() {
    return (
      <div>
        <h1 style={{ textAlign: 'center' }}>Header bar</h1>
        <div id="map"></div>

        <MapContainer style={{ height: '80vh' }} center={[50, 0]} zoom={5}>
          <GeoJSON
            style={this.countryStyle}
            data={countries.features}
            onEachFeature={this.onEachCountry}
          ></GeoJSON>
          <GeoJSON
            data={airports.features}
            pointToLayer={this.changeIcon}
            onEachFeature={this.onEachPoint}
          ></GeoJSON>
        </MapContainer>
        <h1 style={{ textAlign: 'center' }}>Nav Bar</h1>
      </div>
    );
  }
}

async function weatherAPI(x, y) {
  const location = await fetch(
    'https://api.openweathermap.org/data/2.5/weather?lat=' +
      x +
      '&lon=' +
      y +
      '&units=metric' +
      '&appid=25e7a5bf30fbcedaba27b827613f0b08'
  );
  var locationData = await location.json();
  //   console.log(locationData);

  var weatherDataMap = {
    weatherDesc: locationData.weather[0].description,
    temp: locationData.main.temp,
    pressure: locationData.main.pressure,
    humidity: locationData.main.humidity,
    visibility: locationData.visibility,
    windSpeed: locationData.wind.speed,
    windDeg: locationData.wind.deg,
  };

  var tempColor = locationData.main.temp;

  if (tempColor >= 30) {
    countryColor = tempColor01;
  } else if (tempColor < 30 && tempColor > 17) {
    countryColor = tempColor02;
  } else if (tempColor <= 17) {
    countryColor = tempColor03;
  }

  console.log(weatherDataMap.weatherDesc);

  console.log(weatherDataMap.weatherDesc);

  return weatherDataMap;
}

export default MyMap;
