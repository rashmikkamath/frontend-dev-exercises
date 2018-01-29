import React, { Component } from 'react';

export default class Barchart extends Component {
	constructor(props){
		super(props);
		//this.setContext = this.setContext.bind(this);
	}
	componentDidMount(){
		this.setContext();
  	}

  	setContext(){
  		//handle data to get x and y axis parameters
  		var chartData = this.props.data;
  		var yData = chartData.map(function(d,i){
  			return d.key
  		});
  		
  	}

  	render(){

  		
  		return(
  			<div id ="chartholder"></div>
  		)
	}
}
