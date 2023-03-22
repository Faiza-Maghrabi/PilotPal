import React, { Component } from 'react';
import { MapContainer, GeoJSON } from 'react-leaflet';

import countries from './../data/countries.json';
import airports from './../data/airports.json';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import './MyMap.css';
import './popUp.css';
import WeatherBox from './WeatherBox';


class MyMap extends Component {
  constructor(props){
    super(props);
    this.state = {
      showBox: false,
      weatherdesc: "",
      portName: "",
      temp: "",
      pressure: "",
      humidity: "",
      visibility: "",
      windspeed: "",
      windDeg: "",
    }
  }

  resetShowBox = () => {
    this.setState({showBox: false})
  }

  // componentDidMount() {
  //   console.log(airports);
  // }

  countryStyle = {
    //rgb(129, 235, 180)'

    fillColor: 'rgb(129, 235, 180)',
    fillOpacity: 1,
    color: 'rgb(41, 153, 95)',
    weight: 1,
  };

  //pop ups when clicking on each country
  //TO DO: change to onEachAirport to give weather
  onEachCountry = (country, layer, countryID) => {
    //layer represents the drawing of the country that we see on the screen
    //layer.bindPopup(countryName);
    layer.addEventListener('click', async function (e) {
      //when country is clicked, collects the country name and countrycode
      var countryName = country.properties.ADMIN;
      var countryCode = country.properties.ISO_A3;

      //called and returns temperature of the country clicked.
      var temp = await countryColour(countryName, countryCode);
      //changing colour the line below changes the colour of the country

      var countryColor;
      if (temp >= 40){
        countryColor = 'rgb(212, 21, 21)'; //red
      }
      else if (temp < 40 && temp >= 30){
        countryColor = 'rgb(245, 118, 34)'; //orange
      }
      else if (temp < 30 && temp >= 20){
        countryColor = 'rgb(227, 227, 95)'; //yellow
      }
      else if (temp < 20 && temp >= 10){
          countryColor = 'rgb(0,255,127)'; //green
      }
      else if (temp < 10 && temp >= 0){
        countryColor = 'rgb(9, 194, 227)'; //light blue
      }
      else if (temp < 0 && temp >= -20){
        countryColor = 'rgb(18, 139, 252)'; //blue
      }
      else if (temp < -20 && temp >= 40){
        countryColor = 'rgb(18, 112, 252)'; //dark blue
      }
      else if (temp < -40){
          countryColor = 'rgb(18, 45, 252)';//super dark blue
      }
      layer.setStyle({ fillColor: countryColor });
    });
  };

  changeIcon = (latlng) => {
    //override leaflet's default marker with a circleMarker object
    var x = latlng.geometry.coordinates[1];
    var y = latlng.geometry.coordinates[0];
    return L.circleMarker([x, y], {
      fillColor: '#000000',
      radius: 2,
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

    // var radval = 3;
    // if (layer.map.zoom < 5){radval = layer.map.zoom - 2}

    // layer.setStyle({
    //   radius: radval
    // });

    layer.on({
      click: async (e) => {
        var x = point.geometry.coordinates[1];
        var y = point.geometry.coordinates[0];

        var [data,dataLater] = await weatherAPI(x, y);
        console.log("dataLater: ", dataLater)
        console.log("data now:", data)
        // console.log(this.state.showBox)
        this.setState({showBox: true, weatherdesc: data.weatherDesc, portName: portName, temp: data.temp, pressure: data.pressure, humidity: data.humidity, visibility: data.visibility, windspeed: data.windSpeed, windDeg: data.windDeg})
      },
      mouseover: () => {
        layer.setStyle({
          color: 'red'
        });
      },
      mouseout: () => {
        layer.setStyle({
          color: 'black'
        });
      }
      
    });


    // temp: "",
    //   pressure: "",
    //   humidity: "",
    //   visibility: "",
    //   windspeed: "",
    //   windDeg: "",

    // AirportClickEvent = async (e) => {
    //   var x = point.geometry.coordinates[1];
    //   var y = point.geometry.coordinates[0];

    //   var data = await weatherAPI(x, y);

    //   console.log(data);
    // };

    // layer.addEventListener('click', async function (e) {
    //   var x = point.geometry.coordinates[1];
    //   var y = point.geometry.coordinates[0];

    //   var data = await weatherAPI(x, y);

    //   console.log(data);
    //   this.Box("aa")

    //   //   layer.bindPopup(portName);
    //   layer.bindPopup(`
    //   <div class= "popUp">


    //   <p class= 'name'> ${portName} </p> 
    //   <p> Temp: ${data.temp} °C</p> 
    //   <p> Pressure: ${data.pressure} KPa</p> 
    //   <p> Humidity: ${data.humidity} %</p> 
    //   <p> Visibility: ${data.visibility} m</p> 
    //   <p> WindSpeed: ${data.windSpeed} m/s</p> 
    //   <p> WindDeg: ${data.windDeg} °</p> 


    //   </div>
    //   `);
    // });
    //console.log(layer)
  };



  //RENDERING MAP USING GEOJSON AND MAP COMPONENT
  render() {
    return (
      <div>
        <h1 style={{ textAlign: 'center' }}></h1>

        <input
          type="text"
          id="flightSearchBar"
          onkeyup="flightSearch()"
          placeholder="Search for flights..."
        ></input>

        <WeatherBox 
          show={this.state.showBox} 
          weatherDesc={this.state.weatherdesc}
          name={this.state.portName} 
          temp={this.state.temp} 
          pressure={this.state.pressure}
          humidity={this.state.humidity}
          visibility={this.state.visibility}
          windspeed={this.state.windspeed}
          windDeg={this.state.windDeg}
          reset = {this.resetShowBox}
        />

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
        <h1 style={{ textAlign: 'center' }}></h1>
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
      '&appid=ec90bd9de7731df93b1303ecdd186b7d'
  );
  var locationData = await location.json();
  // console.log(locationData);

  var weatherDataMap = {
    weatherDesc: locationData.weather[0].description,
    temp: locationData.main.temp,
    pressure: locationData.main.pressure,
    humidity: locationData.main.humidity,
    visibility: locationData.visibility,
    windSpeed: locationData.wind.speed,
    windDeg: locationData.wind.deg,
  };

  //next couple of days

  const nextDays = await fetch(
    'http://api.openweathermap.org/data/2.5/forecast?lat='+x+'&lon='+y+'&units=metric&appid=25e7a5bf30fbcedaba27b827613f0b08'
  );

  var threeDays = await nextDays.json();
  var nextFewDays = {
    tomorrow : [threeDays.list[12].main.temp,threeDays.list[12].main.pressure,threeDays.list[12].main.humidity,threeDays.list[12].visibility,threeDays.list[12].wind.speed,threeDays.list[12].wind.deg],
    tomorrow2 : [threeDays.list[20].main.temp,threeDays.list[20].main.pressure,threeDays.list[20].main.humidity,threeDays.list[20].visibility,threeDays.list[20].wind.speed,threeDays.list[20].wind.deg],
    tomorrow3 : [threeDays.list[28].main.temp, threeDays.list[28].main.pressure, threeDays.list[28].main.humidity, threeDays.list[28].visibility, threeDays.list[28].wind.speed, threeDays.list[28].wind.deg]
  }
  // console.log("tomorrow: ",threeDays.list[12]);
  // console.log("day after tomorrow: ",threeDays.list[20]);
  // console.log("day after day after tomorrow: ",threeDays.list[28]);
  // console.log(nextFewDays)

  return [weatherDataMap, nextFewDays]
}

//gets capital city of the country clicked and returns their temperature
async function countryColour(countryName, countryCode) {
  var cities = require('./../data/country-by-capital-city.json');

  var capitalCity = '';
  for (let i = 0; i < cities.length; i++) {
    if (cities[i].country == countryName) {
      capitalCity = cities[i].city;
    }
  }

  const location = await fetch(
    'https://api.openweathermap.org/data/2.5/weather?q=' +
      capitalCity +
      ',' +
      countryCode +
      '&units=metric&appid=ec90bd9de7731df93b1303ecdd186b7d'
  );
  var locationData = await location.json();
  return locationData.main.temp;
}

export default MyMap;
