import React, { Component } from 'react';
import * as d3 from "d3";
import Checkboxgrp from './Checkboxgrp.js';
import Barchart from './Barchart.js';
import PropTypes from 'prop-types';

//class that handles data structuring to pass to Barchart class 
export default class Main extends Component{
	constructor(props){
      super(props);
      this.state = {
        selectedOption: 'education'
      };
      this.handleChange = this.handleChange.bind(this);
  }

  //handle the click of checkbox
  handleChange (changeEvent){
		this.setState({
			selectedOption : changeEvent.target.value
		});
	}

	render(){
    
    //required variable declarations    
    var combinedData = {}, groupedData, categoryArr, percentArr = [], option,
    labelText = d3.keys(this.props.data[0]).filter(function(key) { return (key === "education_level" || key === "count") });

    //manipulate data to extract required info to send to Barchart component according to selected option-Education/Race
    if (this.state.selectedOption === "education"){
      groupedData = d3.nest()
      .key(function(d){return d.education_level;})
      .key(function(d){return d.over_50k;})
      .object(this.props.data);
    
      option = 0;

    } else if(this.state.selectedOption === "race"){
      groupedData = d3.nest()
      .key(function(d){return d.race;})
      .key(function(d){return d.over_50k;})
      .object(this.props.data);

      option = 1;
    }  
    //store the category names
    categoryArr = Object.keys(groupedData);

     //calculate and store percent of each category
    Object.keys(groupedData).forEach(function(d){
      percentArr.push(groupedData[d]["1"].length /(groupedData[d]["0"].length+groupedData[d]["1"].length));
    });
   
    //structure data for component 
    combinedData= categoryArr.map(function(x,i){return{"category":x , "per_over_50k":percentArr[i], "labels":labelText}});
    
		return(
			<main role="main" className="container">
				<div className=" col text-center choice-button justify-content-md-center">
					<Checkboxgrp  selectedOption={this.state.selectedOption} handleOptionChange={this.handleChange}/>
          <Barchart data={combinedData} flag={option}/>
        </div>  		
      </main>
		);
	}
}

Main.propTypes = {
  data: PropTypes.array
};