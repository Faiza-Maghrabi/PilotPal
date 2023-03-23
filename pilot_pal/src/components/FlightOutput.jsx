import React from 'react';
import './MyMap.css'

function FlightOutput() {

    var picCLass = 'clear_sky';

    if (!show){return <></>;}
    picCLass = weatherDesc.replace(" ", "_");

    return(
        <div className={picCLass} id='out'>
            <div id='in'>
                <button id='x' onClick={reset}>x</button>
                <h3>{name}</h3>
                <h5>{weatherDesc}</h5>
                <p>Temperature: {temp}°C</p>
                <p>Pressure: {pressure} KPa</p>
                <p>Humidity: {humidity}%</p>
                <p>Visibility: {visibility} m</p>
                <p>Windspeed: {windspeed} m/s at {windDeg}°</p>
            </div>
        </div>
    );


}

export default FlightOutput;