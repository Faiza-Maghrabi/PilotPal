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
        var portName = point.properties.name

        //console.log(layer)
        layer.bindPopup(portName);
    }

    //RENDERING MAP USING GEOJSON AND MAP COMPONENT
    render() {
        return(
            <div>
                <h1 style ={{textAlign:"center"}}>Header bar</h1>
                <input type="text" id="flightSearchBar" onkeyup="flightSearch()" placeholder="Search for flights..."></input>
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
 
export default MyMap;