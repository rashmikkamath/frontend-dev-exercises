import React, { Component } from 'react';
import * as d3 from "d3";
import PropTypes from 'prop-types';

//class to render bar chart using d3
export default class Barchart extends Component{
    constructor(props){
        super(props)
        this.createBarChart = this.createBarChart.bind(this)
    }

	componentDidMount(){
		this.createBarChart();
	}

    //pass reins to d3 to create chart
	createBarChart() {

        var chartData = this.props.data, labelTextArr = this.props.labelTextArr;
		var formatPercent = d3.format(".0%"), padding = 100, mainBarColor = '#000080', backBarColor = '#ADD8E6'  ;
		
		//create svg with dimensions
		var svg = d3.select("#chartholder")
        .append("svg")
        .attr("id","svg-chart")
        .attr("width",760)
        .attr("height",400)
		
		var margin = {top: 20, right: 20, bottom: 60, left: 10},
        width = svg.attr("width") - margin.left - margin.right,
        height = svg.attr("height") - margin.top - margin.bottom;

        var g = svg.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //define x & y axis scales
        var x = d3.scaleLinear().range([0, width]);
        var y = d3.scaleBand().range([height, 0]);
		
		//prepare data to sort ascending order of percentage
		chartData.sort(function(a, b) { return a.per_over_50k - b.per_over_50k; });

		//scaleLinear domain requirs at least two values, min and max       
		x.domain([0, 1]);

        // scaleBand domain should be an array of specific values
        // in our case, we want to use categories
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
           
        //draw & color background bar,less than 50K 
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
        .attr('width', function() {return x(1);} )
        .attr('fill', backBarColor);

        //draw and color bars , over 50K 
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
        .attr('fill', mainBarColor)
        .on("end",function(){
            //set bar labels only after bar transition ends
            g.selectAll(".text")         
            .data(chartData)
            .enter()
            .append("text")
            .attr("class","label")
            .attr("y", (function(d) { return y(d.category) + y.bandwidth()/4 ; }  ))
            .attr("x", function(d) { return x(d.per_over_50k)-24; })
            .attr("dy", ".75em")
            .text(function(d) { return Math.trunc(d.per_over_50k *100) + "%" })
            .attr('fill', "white")
        });

        //Legend color scale
        var color = d3.scaleOrdinal()
        .domain(["True", "False"])
        .range([mainBarColor,backBarColor]);

        //position the legend
        var legend = svg.selectAll(".legend")
        .data([labelTextArr[2],labelTextArr[3]])//label text derived from label data passed from parent
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        // draw legend colored rectangles
        legend.append("rect")
        .attr("x", 0)
        .attr("y",-30)
        .attr("width", 15)
        .attr("height", 15)
        .style("fill", function(d){return color(d)});

        // draw legend text
        legend.append("text")
        .attr("x",20)
        .attr("y", -22)
        .attr("dy", ".35em")
        .text(function(d) { return d;});
        
        //add the axes labels
        g.append("text")
        .classed('labeltext',true)
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (-margin.left - 100) +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .text(labelTextArr[0]);

        g.append("text")
        .classed('labeltext',true)
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (width/2) +","+(height+(padding/2))+")")  // centre below axis
        .text(labelTextArr[1]);
	
	}

	render(){
		return(
			<div id = "chartholder"></div>
		)
	}

	componentDidUpdate(){
		d3.select("#svg-chart").remove();
		this.createBarChart();
	}
}
Barchart.propTypes = {
  data: PropTypes.array.isRequired,
  labelTextArr : PropTypes.array,
  flag : PropTypes.number
};