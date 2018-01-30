import React, { Component } from 'react';
import * as d3 from "d3";


export default class Exp extends Component{
	
	componentDidMount(){
		var chartData=this.props.data;
		var formatPercent = d3.format(".0%");

		//create svg with dimensions
		var svg = d3.select("#chartholder")
					.append("svg")
					.attr("width",860)
					.attr("height",300);

		var margin = {top: 20, right: 20, bottom: 30, left: 80},
	    	width = svg.attr("width") - margin.left - margin.right,
	    	height = svg.attr("height") - margin.top - margin.bottom;

	    var g = svg.append("g")
				   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	    
	    //tooltip


	    //define x & y axis range
	    var x = d3.scaleLinear().range([0, width]);
		var y = d3.scaleBand().range([height, 0]);

		//prepare data to sort ascending order of percentage
		chartData.sort(function(a, b) { return a.per_over_50k - b.per_over_50k; });
		
		// x and y domains 
		x.domain([0, 1]);
		y.domain(chartData.map(function(d) { return d.category; })).padding(0.1);

		//draw the x axis  
		g.append("g")
        .attr("class", "x axis")
       	.attr("transform", "translate(0," + height + ")")
      	.call(d3.axisBottom(x).ticks(10).tickSizeInner([-height]).tickFormat(formatPercent).tickPadding(10));

      	//draw the y axis
      	 g.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y));
        
        //draw chart rectangles
        g.selectAll(".bar")
        .data(chartData)
      	.enter().append("rect")
        .attr("class", "bar")
        .attr("background","red")
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", function(d) { return y(d.category); })
        .attr("width", function(d) { return x(d.per_over_50k)/100; })
        .attr('fill', 'lightblue');

		
	}

	render(){
		return(
			<div id="chartholder"></div>
			)
	}
}