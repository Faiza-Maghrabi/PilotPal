import React, {Component} from 'react';
import { MapContainer, GeoJSON } from 'react-leaflet';
import mapData from './../data/countries.json';
import 'leaflet/dist/leaflet.css';
import './MyMap.css';

class MyMap extends Component {
    state = {};

    componentDidMount(){
        console.log(mapData);
    }

    countryStyle = {
        fillColor: 'rgb(129, 235, 180)',
        fillOpacity: 1,
        color: 'rgb(41, 153, 95)',
        weight: 1,
    };

    //pop ups when clicking on each country 
    //TO DO: change to onEachAirport to give weather
    onEachCountry = (country, layer) =>{
        const countryName = country.properties.ADMIN;

        //layer represents the drawing of the country that we see on the screen
        layer.bindPopup(countryName);
        layer.addEventListener('click', function(e){
            //look at event handles from year 1
            console.log(layer)
            layer.options.fillColor = "blue";
            layer.options.color = "blue";
            layer.options.style = {};
        });

        // function changeColour(e){
        //    
        // }
    }

    //RENDERING MAP USING GEOJSON AND MAP COMPONENT
    render() {
        return(
            <div>
                <h1 style ={{textAlign:"center"}}>Header bar</h1>
                <MapContainer 
                    style={{height:'80vh'}}
                    center={[0,0]} 
                    zoom={3}>

                        <GeoJSON style={this.countryStyle} data={mapData.features} onEachFeature={this.onEachCountry}></GeoJSON>
                </MapContainer> 
                <h1 style={{textAlign: 'center'}}>Nav Bar</h1>
            </div>
        ); 
    }
} 
 
export default MyMap;