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
    
    var combinedData = {}, groupedData, categoryArr, percentArr = [], option;

    //manipulate data to extract required info to send to Barchart component according to selected option-Education/Race
    if (this.state.selectedOption === "education"){
      groupedData = d3.nest()
      .key(function(d){return d.education_level;})
      .key(function(d){return d.over_50k;})
      .object(this.state.chartData);
    
      option = 0;

    } else if(this.state.selectedOption === "race"){
      groupedData = d3.nest()
      .key(function(d){return d.race;})
      .key(function(d){return d.over_50k;})
      .object(this.state.chartData);

      option = 1;
    }  

    //store the category names
    categoryArr = Object.keys(groupedData);

     //calculate and store percent of each category
    Object.keys(groupedData).forEach(function(d){
      percentArr.push(groupedData[d]["1"].length /(groupedData[d]["0"].length+groupedData[d]["1"].length));
    });
   
    //structure data for component 
    combinedData= categoryArr.map(function(x,i){return{"category":x , "per_over_50k":percentArr[i]}});
    
    return (
      <div className="App">
        <nav className="navbar navbar-default ">
          <span className="navbar-text text-center">
            Welcome
          </span>
        </nav>
        <main role="main" className="container">
        <div className="row"></div>
          <div id="choice" className="row">
              <div className=" col text-center choice-button justify-content-md-center">
                <form>
                  <div className="checkbox">
                    <label><input type="radio" value="education" checked={this.state.selectedOption === 'education'} onChange={this.handleOptionChange}/> Education</label>
                  </div>
                  <div className="checkbox">
                    <label><input className ="checkbox" type="radio" value="race" checked={this.state.selectedOption === 'race'} onChange={this.handleOptionChange}/> Race</label>
                  </div>
                </form>
                <Barchart data={combinedData} flag={option}/>
              </div>
          </div>
          <div className="row"></div>
        </main>
      </div>
    );
  }
}


