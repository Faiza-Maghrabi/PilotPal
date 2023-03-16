import React, {Component} from 'react';
import {MapContainer, GeoJSON } from 'react-leaflet';

import countries from './../data/countries.json';
import airports from './../data/airports.json';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import './MyMap.css';

class MyMap extends Component {
    state = {};

    componentDidMount(){
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
    onEachCountry = (country, layer) =>{
        //const countryName = country.properties.ADMIN;

        //layer represents the drawing of the country that we see on the screen
        //layer.bindPopup(countryName);
        layer.addEventListener('click', function(e){

            //changing colour the line below changes the colour of the country
            //context of this function needs to be changed - colour of country she be difference for each day/ should be updated via data pulled from the api
            //currently changes colour when country is clicked
            layer.setStyle({fillColor: 'rgb(50,50,50)'});

        });

    }

    changeIcon = (latlng) =>{
        //override leaflet's default marker with a circleMarker object
        var x = latlng.geometry.coordinates[1]
        var y = latlng.geometry.coordinates[0]
        return L.circleMarker([x,y], {
            fillColor: '#000000',
            radius: 3,
            weight: 5,
            color: '#000000'
        });

    }

    onEachPoint = (point, layer) =>{
        //this part should be used when the user clicks on a point 
        //place holder code gives popup with port name
        //some airports have no name for name_en etc and some are fully in different alphabets
        var portName = point.properties.name_en
        if(portName == null){
            portName = point.properties.name
        }

        layer.addEventListener('click', function(e){
            
            var x = point.geometry.coordinates[1]
            var y = point.geometry.coordinates[0]

            var data = weatherAPI(x,y)


            layer.bindPopup(portName);
        });
        //console.log(layer)
    }

    //RENDERING MAP USING GEOJSON AND MAP COMPONENT
    render() {
        return(
            <div>
                <h1 style ={{textAlign:"center"}}>Header bar</h1>
                <div id="map"></div>

                <MapContainer 
                    style={{height:'80vh'}}
                    center={[50,0]} 
                    zoom={5}>

                        <GeoJSON style={this.countryStyle} data={countries.features} onEachFeature={this.onEachCountry}></GeoJSON>
                        <GeoJSON data={airports.features} pointToLayer={this.changeIcon} onEachFeature={this.onEachPoint}></GeoJSON>
                        
                </MapContainer> 
                <h1 style={{textAlign: 'center'}}>Nav Bar</h1>
            </div>
        ); 
    }
}

async function weatherAPI(x,y){
    const location = await fetch("http://api.openweathermap.org/geo/1.0/reverse?lat="+x+"&lon="+y+"&limit=1&appid=ec90bd9de7731df93b1303ecdd186b7d");
    var locationData = await location.json()
    var locationArr = [locationData[0].name, locationData[0].country]

    const weather = await fetch("http://api.openweathermap.org/data/2.5/weather?q="+locationArr[0]+","+locationArr[1]+"&APPID=25e7a5bf30fbcedaba27b827613f0b08")
    var weatherData = await weather.json()
    
    var weatherDataMap = {
        "weatherDesc": weatherData.weather[0].description,
        "temp": weatherData.main.temp,
        "pressure": weatherData.main.pressure,
        "humidity": weatherData.main.humidity,
        "visibility": weatherData.visibility,
        "windSpeed": weatherData.wind.speed,
        "windDeg": weatherData.wind.deg,
    }

    console.log(weatherDataMap.weatherDesc);
    return weatherDataMap
}
 
export default MyMap;