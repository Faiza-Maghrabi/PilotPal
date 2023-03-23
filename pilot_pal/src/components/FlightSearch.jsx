import React, { Component} from 'react';
import './MyMap.css'

class FlightSearch extends Component{

    constructor(props) {
        super(props);
        this.state = {
            flights: []
        }
    }
    // searchSubmitted(event) {
    //     console.log("Search has been submitted");
    //     let q = document.getElementById("flightSearchInput")
    //     flightSearch(q);
    //   }
      
    flightSearch = () => {
      
        // let params = new URLSearchParams({
        //   access_key: "19af92ce01f489a1a4c60b022a1eb4cb",
        //   flight_iata: iata
        // })
        // var logs = []
        if (this.state.flights.length !== 100) {
            this.getFlightData()
            //this.setState({flights: []})
        }

        console.log("test")
        console.log(this.state.flights)

        // this.setState({})
        // console.log(this.setState)
      };

      getFlightData = () => {
          //api call only needs to occur once
          fetch('http://api.aviationstack.com/v1/flights?access_key=1060fc65fd48ff212ed8d543d8c1ce17').then(res => res.json()).then((result) => {
            for (let i = 0; i < result.data.length; i++) {
                this.setState({flights: this.state.flights.push(result.data[i])})

            }
            }).catch()

 
      }
      

      render() {
        return(
            <div>
                <input type="search" id="flightSearchInput" name="flightSearchInput" placeholder="Search for flight number..."></input>
                <button type="submit" id="flightSearchButton" onClick={this.flightSearch}>Search</button>
            </div>
    
        );
      }

}

export default FlightSearch;