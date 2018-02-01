
import React, { Component } from 'react';
import '../css/App.css';
import * as d3 from "d3";
import Navheader from './Navheader.js';
import Main from './Main.js';

// Class that parses csv data and passes to Main component
export default class App extends Component {
  constructor(props){
      super(props);
      this.state = {};   
  }

  componentWillMount() {
      var self=this;
      //read the csv file and extract required data to pass to Main component
      d3.csv("census.csv", function(error,data){
        if(error){
          self.setState({loadError:true});
        }else{
          data.forEach(function(d){
          d.over_50k = +d.over_50k;//convert to number
          });
          self.setState({chartData:data});
        }
      });
  }
  
  render() {
    //handle cases where there is an error loading data from csv file or time loading data
    if(this.state.loadError){
      return <div>Error loading data</div>
    }

    if(!this.state.chartData){
        return <div>Loading</div>
    }
    
    return (
      <div className="App">
        <Navheader/>
        <Main data = {this.state.chartData}/>
      </div>
    );
  }
}


