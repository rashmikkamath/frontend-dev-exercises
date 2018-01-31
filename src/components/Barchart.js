import React, { Component } from 'react';
import * as d3 from "d3";


export default class Barchart extends Component{

	componentDidMount(){

		this.setContext();
	}

	setContext() {
		var chartData=this.props.data;
		var formatPercent = d3.format(".0%"), padding =100;
		
		//create svg with dimensions
		var svg = d3.select("#chartholder")
				  .append("svg")
				  .attr("id","svg-chart")
			      .attr("width",760)
				  .attr("height",400)
					
		var margin = {top: 20, right: 20, bottom: 30, left: 80},
	    	width = svg.attr("width") - margin.left - margin.right,
	    	height = svg.attr("height") - margin.top - margin.bottom;

	    var g = svg.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	    
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
      	.call(d3.axisBottom(x).ticks(10).tickSizeInner([-height]).tickPadding(10).tickFormat(formatPercent));

      	//draw the y axis
      	g.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y));
       
        //draw & color background bar,less than 50K pink
        g.selectAll('rect .background')
        .data(chartData)
       	.enter()
       	.append('rect')
       	.classed('background', true)
       	.attr("y", function(d) { return y(d.category); })
       	.transition()
		.duration(1500)
       	.attr('x', 0)
       	.attr("height", y.bandwidth()-10)
       	.attr('width', function(d) {return x(1);} )
       	.attr('fill', 'lightpink');

       	//draw and color bars , over 50K blue
        g.selectAll('rect .bar')
       	.data(chartData)
       	.enter()
       	.append('rect')
       	.classed('bar', true)
       	.transition()
		.duration(1000)
       	.attr("y", function(d) { return y(d.category); })
       	.attr('x', 0)
       	.attr("height", y.bandwidth()-10)
       	.attr("width", function(d) { return x(d.per_over_50k); })
       	.attr('fill', 'lightblue');
       	
       	//Label Text for axes
       	var textLabel;
       	if (this.props.flag === 0){
       		textLabel = "Education";

       	} else if(this.props.flag === 1){
       		textLabel = "Race";

       	}
       	g.append("text")
       	.classed('labeltext',true)
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (-margin.left - 30) +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .text(textLabel);

        g.append("text")
        .classed('labeltext',true)
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (width/2) +","+(height+(padding/2))+")")  // centre below axis
        .text("Count");
		
	}

	render(){
		return(
			<div id="chartholder"></div>
			)
	}

	componentDidUpdate(){
		d3.select("#svg-chart").remove();
		this.setContext();
	}
	

}