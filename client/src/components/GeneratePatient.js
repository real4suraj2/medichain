import React, {Component} from 'react';
import {FormGroup, FormControl, Radio, Button} from 'react-bootstrap';

export default class GeneratePatient extends Component {
	state = {email : '', password : '', confirmPassword : '', name : '', dob : '', sex : '', message : ''}
	constructor(props){
		super(props);
		}
	onEmailChange = event =>{
		this.setState({email : event.target.value});
	}
	onNameChange = event =>{
		this.setState({name : event.target.value});
	}
	onDobChange = event =>{
		this.setState({dob : event.target.value});
	}
	onPasswordChange = event =>{
		this.setState({password : event.target.value});
	}
	onConfirmPasswordChange = event =>{
		this.setState({confirmPassword : event.target.value});
	}
	onSexChange = event => {
		this.setState({sex : event});
		}
	onFormSubmit = event => {
		const {email, password, confirmPassword, dob, name, sex} = this.state;
		fetch(`${document.location.origin}/api/signUp`,{
			method : 'POST',
			headers : {'Content-Type' : 'application/json'},
			body : JSON.stringify({email, password, dob, name, sex, type : 'patient'})
			})
			.then(res => res.json())
			.then(json => this.setState({message : json.message}));
		}
	render(){
		const {message} = this.state;
		return(
		<div>
		{
		message ? (<div>{message}</div>) : (<div></div>)
		}
		<FormGroup>
			<FormGroup>
				<FormControl
				  type = "email"
				  input = "text"
				  placeholder = "Email Address"
				  value = {this.state.email}
				  onChange = {this.onEmailChange}
				 />
			</FormGroup>
			<FormGroup>
				<FormControl
				  input = "text"
				  placeholder = "Name"
				  value = {this.state.name}
				  onChange = {this.onNameChange}
				 />
			</FormGroup>
			<FormGroup>
				<FormControl
				  type = "date"
				  input = "text"
				  placeholder = "DOB"
				  value = {this.state.dob}
				  onChange = {this.onDobChange}
				 />
			</FormGroup>
			<FormGroup>
				<FormControl
				  type = "password"
				  input = "text"
				  placeholder = "Password"
				  value = {this.state.password}
				  onChange = {this.onPasswordChange}
				 />
			</FormGroup>
			<FormGroup>
				<FormControl
				  type = "password"
				  input = "text"
				  placeholder = "Confirm Password"
				  value = {this.state.confirmPassword}
				  onChange = {this.onConfirmPasswordChange}
				 />
			</FormGroup>
			<FormGroup>
				<Radio name = "groupOptions" onClick={()=>this.onSexChange('male')}>Male</Radio>
				<Radio name = "groupOptions" onClick={()=>this.onSexChange('female')}>Female</Radio>
			</FormGroup>
			<Button bsStyle="danger" onClick={this.onFormSubmit} > Register </Button>
		</FormGroup>
		</div>
		)
		}
	}
