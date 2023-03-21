import React, { Component } from 'react';
import './MyMap.css'

var backImg = './../img/few-clouds.jpg';

let dialogStyles = {

    width: '320px',
    maxWidth: '100%',
    position: 'fixed',
    left: '50%',
    top: '25%',
    transform: 'translate(-50%,-50%)',
    zIndex: '999',
    //backgroundColor: 'rgb(129, 235, 180)',
    backgroundImage: 'url('+backImg+')',
    backgroundSize: 'contain',

    padding: '20px 20px 20px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',

    border: '1px solid #000000',
    borderRadius: '10px',

};



function WeatherBox({show, weatherDesc, name, temp, pressure, humidity, visibility, windspeed, windDeg, reset}) {

    if (!show){return <></>;}


    switch (weatherDesc) {
        case 'clear sky':
            backImg = './../img/clear-sky.jpg'
            break;
        case 'few clouds':
            backImg = './../img/few-clouds.jpg'
            break;
        case 'broken clouds':
            backImg = './../img/broken-clouds.jpg'
            break;
        case 'scattered clouds':
            backImg = './../img/scattered-clouds.jpg'
            break;
        case 'shower rain':
            backImg = './../img/shower-rain.jpg'
            break;
        case 'rain':
            backImg = './../img/rain.jpg'
            break;
        case 'thunderstorm':
            backImg = './../img/thunderstorm.jpg'
            break;
        case 'snow':
            backImg = './../img/snow.jpg'
            break;
        case 'mist':
            backImg = './../img/mist.jpg'
            break;
        default:
            break;
    }
    console.log(backImg)

    return(
        <div id='out' style={dialogStyles}>
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

export default WeatherBox;