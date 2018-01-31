import React, { Component } from 'react';
import '../css/App.css';
import * as d3 from "d3";
import Barchart from './Barchart.js';



export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      
      selectedOption: 'education'
    };
    this.handleOptionChange = this.handleOptionChange.bind(this);
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

  handleOptionChange (changeEvent){
    
    this.setState({
      selectedOption : changeEvent.target.value
    })

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
    var fauxEducationData = [{category:"Bachelors", per_over_50k:.78},
                    {category:"Associates", per_over_50k:.67},
                    {category:"No degree", per_over_50k:.34},
                    {category:"High School", per_over_50k:.44},
                    {category:"Some College", per_over_50k:.4}
    ];

    var fauxRaceData = [{category:"Asian-Pac-Islander", per_over_50k:.98},
                    {category:"Whites", per_over_50k:.67},
                    {category:"Blacks", per_over_50k:.34}
    ];

    var data,flag;

    if (this.state.selectedOption === "education"){
      data = fauxEducationData;
      flag = 0;

    } else if(this.state.selectedOption === "race"){
      data = fauxRaceData;
      flag = 1;

    }    
    
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome</h1>
        </header>
        <div id="choice">
          <div className="choice-button">
            <form>
              <label><input type="radio"  name="dataset" value="education" checked={this.state.selectedOption === 'education'} onChange={this.handleOptionChange}/> Education</label>
              <label><input type="radio"  name="dataset" value="race" checked={this.state.selectedOption === 'race'} onChange={this.handleOptionChange}/> Race</label>
            </form>
          </div>
          <Barchart data={data} flag={flag}/>
          
        </div>
      </div>
    );
  }
}


