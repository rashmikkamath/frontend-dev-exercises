import React, { Component } from 'react';
import '../css/App.css';
import * as d3 from "d3";
import Barchart from './Barchart.js';



export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  componentWillMount() {
    var self=this;
    //read the csv file and extract required data to pass to barchart component
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
    /*var dataForChart = d3.nest()
        .key(function(d) { return d.education_level; })
        .key(function(d){return d.over_50k})
        .entries(this.state.chartData);*/

    //Design UI with faux data
    var fauxData = [{category:"Bachelors", per_over_50k:78},
                    {category:"Associates", per_over_50k:67},
                    {category:"No degree", per_over_50k:34},
                    {category:"High School", per_over_50k:44},
                    {category:"Some College", per_over_50k:4}
    ];
    
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome</h1>
        </header>
        <Barchart data={fauxData}/>
      </div>
    );
  }
}


