import React, { Component } from 'react';
import '../css/App.css';
import * as d3 from "d3";
import Barchart from './Barchart.js';

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {};
    //this.createBarChart = this.createBarChart.bind(this);
  }

  componentWillMount() {
    var self=this;
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
    //handle cases where data has error loading or taking time to load
    
    if(this.state.loadError){
      return <div>Error loading data</div>
    }
    
    if(!this.state.chartData){
        return <div>Loading</div>
    }
    //manipulate data to extract required info to send to Barchart component
    var dataForChart = d3.nest()
        .key(function(d) { return d.education_level; })
        .key(function(d){return d.over_50k})
        .entries(this.state.chartData);
        

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome</h1>
        </header>
      
        <Barchart data={dataForChart}/>
      
      </div>
    );
  }
}


