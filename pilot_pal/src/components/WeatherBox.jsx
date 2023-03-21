import React, { Component } from 'react';

let dialogStyles = {
    width: '500px',
    maxWidth: '100%',
    margin: '0 auto',
    position: 'fixed',
    left: '50%',
    top: '28%',
    transform: 'translate(-50%,-50%)',
    zIndex: '999',
    backgroundColor: '#eee',
    padding: '10px 20px 40px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column'
};

// let dialogCloseButtonStyles = {
//     marginBottom: '15px',
//     padding: '3px 8px',
//     cursor: 'pointer',
//     borderRadius: '50%',
//     border: 'none',
//     width: '30px',
//     height: '30px',
//     fontWeight: 'bold',
//     alignSelf: 'flex-end'
// };


function WeatherBox({show, name, temp, pressure, humidity, visibility, windspeed, windDeg, reset}) {

    if (!show){return <></>;}

    return(
        <div style={dialogStyles}>
            <h1>{name}</h1>
            <p>{temp}</p>
            <p>{pressure}</p>
            <p>{humidity}</p>
            <p>{visibility}</p>
            <p>{windspeed}</p>
            <p>{windDeg}</p>
            <button onClick={reset}>x</button>
        </div>
    );
}

export default WeatherBox;