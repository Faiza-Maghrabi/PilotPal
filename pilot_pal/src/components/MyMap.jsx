import React, { Component } from 'react';
import { MapContainer, GeoJSON } from 'react-leaflet';

import countries from './../data/countries.json';
import airports from './../data/airports.json';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import './MyMap.css';
import './popUp.css';
import PullUpMenu from './PullUpMenu';
import WeatherBox from './WeatherBox';
// import FlightSearch from './FlightSearch';



class MyMap extends Component {
  //defining states to communicate with WeatherBox
  constructor(props) {
    super(props);
    this.state = {
      showBox: false,
      showPullUp: false,
      weatherdesc: '',
      portName: '',
      temp: '',
      pressure: '',
      humidity: '',
      visibility: '',
      windspeed: '',
      windDeg: '',
      currentWeather: {},
      dailyWeather: {},

      userVal: '',
    };
  }

  //method to hide Weather
  resetShowBox = () => {
    this.setState({ showBox: false });
    if (this.state.showPullUp === true){this.setState({showPullUp: false})}
  };

  //initial styling for the countries in the country geojson
  countryStyle = {
    fillColor: 'rgb(129, 235, 180)',
    fillOpacity: 1,
    color: 'rgb(41, 153, 95)',
    weight: 1,
  };

  //function used for pullUpMenu, retreives the correct weather data for the date selected
  handleOptionClick = (option) => {
    if (this.state.showBox === true) {
      if (option === 0) {
        this.setState((prevState) => ({
          temp: prevState.currentWeather.temp,
          pressure: prevState.currentWeather.pressure,
          humidity: prevState.currentWeather.humidity,
          visibility: prevState.currentWeather.visibility,
          windspeed: prevState.currentWeather.windSpeed,
          windDeg: prevState.currentWeather.windDeg,
        }));
      } else {
        this.setState((prevState) => ({
          temp: prevState.dailyWeather.temp[option - 1],
          pressure: prevState.dailyWeather.pressure[option - 1],
          humidity: prevState.dailyWeather.humidity[option - 1],
          visibility: prevState.dailyWeather.visibility[option - 1],
          windspeed: prevState.dailyWeather.wind[option - 1].speed,
          windDeg: prevState.dailyWeather.wind[option - 1].deg,
        }));
      }
    }
  };


  //pop ups when clicking on each country
  onEachCountry = (country, layer) => {
    //layer represents the drawing of the country that we see on the screen

    layer.addEventListener('click', async function (e) {
      //when country is clicked, collects the country name and countrycode
      var countryName = country.properties.ADMIN;
      var countryCode = country.properties.ISO_A3;

      //called and returns temperature of the country clicked.
      var temp = await countryColour(countryName, countryCode);
      //using the temp to decide the colour of the country

      var countryColor;
      if (temp >= 40) {
        countryColor = 'rgb(212, 21, 21)'; //red
      } else if (temp < 40 && temp >= 30) {
        countryColor = 'rgb(235, 118, 34)'; //orange
      } else if (temp < 30 && temp >= 20) {
        countryColor = 'rgb(227, 227, 95)'; //yellow
      } else if (temp < 20 && temp >= 10) {
        countryColor = 'rgb(0,230,127)'; //green
      } else if (temp < 10 && temp >= 0) {
        countryColor = 'rgb(9, 194, 227)'; //light blue
      } else if (temp < 0 && temp >= -20) {
        countryColor = 'rgb(18, 139, 252)'; //blue
      } else if (temp < -20 && temp >= 40) {
        countryColor = 'rgb(18, 112, 252)'; //dark blue
      } else if (temp < -40) {
        countryColor = 'rgb(18, 45, 252)'; //super dark blue
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

  //method kept within every airport point
  onEachPoint = (point, layer) => {

    //standardising airport names
    var portName = point.properties.name_en;
    if (portName == null) {
      portName = point.properties.name;
    }

    //click event for each point, retreives weather data and changes component states accordingly for the WeatherBox
    layer.on({
      click: async (e) => {
        var x = point.geometry.coordinates[1];
        var y = point.geometry.coordinates[0];
        this.setWeatherStates(x, y, portName)

      },

      mouseover: () => {
        layer.setStyle({
          color: 'red',
        });
      },
      mouseout: () => {
        layer.setStyle({
          color: 'black',
        });
      },
    });
  };

  setWeatherStates = (x,y, name) =>{
    weatherAPI(x, y).then((data) => {
      const { currentWeather, dailyWeather } = data;
      this.setState(
        (prevState) => {
          return {
            ...prevState,
            currentWeather: currentWeather,
            dailyWeather: dailyWeather,
            showBox: true,
            showPullUp: true,
            weatherdesc: currentWeather.weatherDesc,
            portName: name,
            temp: currentWeather.temp,
            pressure: currentWeather.pressure,
            humidity: currentWeather.humidity,
            visibility: currentWeather.visibility,
            windspeed: currentWeather.windSpeed,
            windDeg: currentWeather.windDeg,
          };
        },
      );
    });
  }

  //method to update internal state according to user input
  UpdateVal = (event) => {
    this.setState({userVal: event.target.value})
  }

  //uses user inputs to get the latlong values for the location - this is used to get weather
  OutputSearch = async () => {
    var data = await LatLongSearch(this.state.userVal)
    if (data === null){return}
    this.setWeatherStates(data[0], data[1], this.state.userVal)

  }

  //RENDERING MAP USING GEOJSON AND MAP COMPONENT
  //search bar, weatherbox, map container and pull up menu are all defined here for user interaction
  render() {
    return (
      <div>

        <div>
          <input type="search"  onChange={this.UpdateVal} id="flightSearchInput" placeholder="Search for location..."></input>
          <button type="submit" id="flightSearchButton" onClick={this.OutputSearch}> Search</button>
        </div>

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
          reset={this.resetShowBox}
        />

        <MapContainer style={{ height: '95vh' }} center={[50, 0]} zoom={5}>
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

        <PullUpMenu show={this.state.showPullUp} onOptionClick={this.handleOptionClick} />
      </div>
    );
  }
}

//Method that uses the lat and long values to retreive weather data from an api
//this includes the next couple of days alongside the current moment
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
    'http://api.openweathermap.org/data/2.5/forecast?lat=' +
      x +
      '&lon=' +
      y +
      '&units=metric&appid=25e7a5bf30fbcedaba27b827613f0b08'
  );

  var threeDays = await nextDays.json();

  const nextFewDays = {
    temp: [
      threeDays.list[12].main.temp,
      threeDays.list[20].main.temp,
      threeDays.list[28].main.temp,
    ],
    pressure: [
      threeDays.list[12].main.pressure,
      threeDays.list[20].main.pressure,
      threeDays.list[28].main.pressure,
    ],
    humidity: [
      threeDays.list[12].main.humidity,
      threeDays.list[20].main.humidity,
      threeDays.list[28].main.humidity,
    ],
    visibility: [
      threeDays.list[12].visibility,
      threeDays.list[20].visibility,
      threeDays.list[28].visibility,
    ],
    wind: [
      {
        speed: threeDays.list[12].wind.speed,
        deg: threeDays.list[12].wind.deg,
      },
      {
        speed: threeDays.list[20].wind.speed,
        deg: threeDays.list[20].wind.deg,
      },
      {
        speed: threeDays.list[28].wind.speed,
        deg: threeDays.list[28].wind.deg,
      },
    ],
  };

  return { currentWeather: weatherDataMap, dailyWeather: nextFewDays };
}

//gets capital city of the country clicked and returns their temperature via api fetch request
async function countryColour(countryName, countryCode) {
  var cities = require('./../data/country-by-capital-city.json');

  var capitalCity = '';
  for (let i = 0; i < cities.length; i++) {
    if (cities[i].country === countryName) {
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

//gets user search and returns latlong values
async function LatLongSearch(loc){
  try {
    const location = await fetch(
      'http://api.openweathermap.org/geo/1.0/direct?q='+loc+'&appid=ec90bd9de7731df93b1303ecdd186b7d'
    );
    var locationData = await location.json();
    return [locationData[0].lat, locationData[0].lon]
  } catch (error) {
    return null
  }
}

export default MyMap;
