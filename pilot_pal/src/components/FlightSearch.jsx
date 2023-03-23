import React, { Component} from 'react';
import './MyMap.css'

class FlightSearch extends Component{

    constructor(props) {
        super(props);
        this.state = {
            flights: [],
            userICAO: 'LNI57'
        }
    }
      

      getFlightData = () => {
          //api call only needs to occur once
          //does not work as subscription does not support https links but browsers default to https
          fetch(`http://api.aviationstack.com/v1/flights?access_key=d0054d841ed750cf7ef5afd7fa982104`).then(res => res.json()).then((result) => {
              console.log(result.data)
              //this.setState({flights: result.data})
            // for (let i = 0; i < result.data.length; i++) {
            //     this.setState({flights: this.state.flights.push(result.data[i])})

            // }
            }).catch()
      }
      
      UpdateVal = (event) => {
        this.setState({userICAO: event.target.value})
        console.log(this.state.userICAO)
      }

      render() {
        return(

            <div>
                <input type="search"  onChange={this.UpdateVal} id="flightSearchInput" name="flightSearchInput" placeholder="Search for flight number..."></input>
                <button type="submit" id="flightSearchButton" onClick={this.getFlightData}>Search</button>
            </div>
    
        );
      }

}

export default FlightSearch;