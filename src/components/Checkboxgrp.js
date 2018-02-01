import React, { Component } from 'react';
import PropTypes from 'prop-types';

//class to render checkboxes
export default class Checkboxgrp extends Component{
	render(){
		return(
			<form>
				<div>
					<div className="checkbox">
						<label><input type="radio" value="education" checked={this.props.selectedOption === "education"} onChange={this.props.handleOptionChange}/> Education</label>
					</div>
					<div className="checkbox">
						<label><input className ="checkbox" type="radio" value="race" checked={this.props.selectedOption ==="race"} onChange={this.props.handleOptionChange}/> Race</label>
					</div>
					</div>
					</form>
		)
	}
}

Checkboxgrp.propTypes = {
  selectedOption: PropTypes.string,
  handleOptionChange : PropTypes.func
};