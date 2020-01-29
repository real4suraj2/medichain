import React, {Component} from 'react';
import QRCode from 'react-google-qrcode';

import {FormGroup, FormControl, Button} from 'react-bootstrap';

export default class GenerateDepartment extends Component {
	state = {email: '', password: '', confirmPassword: '',name : '',message: ''}
	constructor(props){
		super(props);
		}
	onNameChange = event => {
		this.setState({name : event.target.value})
		}
	onEmailChange = event => {
		this.setState({email : event.target.value})
		}
	onPasswordChange = event => {
		this.setState({password : event.target.value})
		}
	onConfirmPasswordChange = event => {
		this.setState({confirmPassword : event.target.value})
		}
	onFormSubmit = event => {
		const {email, password, confirmPassword, name } = this.state;
		fetch(`${document.location.origin}/api/signUp`,{
			method : 'POST',
			headers : { 'Content-Type' : 'application/json' },
			body : JSON.stringify({email, password, confirmPassword, name, type : 'department'})
			})
		.then(res => res.json())
		.then(json => this.setState({message: json.message}));
		
		}
	render(){
		const {message} = this.state;
		return(
		<div>
			{
			message !== '' && message.length < 80 ? (<div>{message}</div>) : (<div></div>)	
			}
			{
			message.length > 80 ? (<div className="centrify">
			<QRCode
            data={message}
            size={350}
            framed
          />
          <div><p><strong>Address</strong></p>
          {message}
          </div>
          <br />
          <br />
          <br />
          <div>
			Department Creation Successful !! Validation request has been sent to the central authority , please reach the central authority for verification with the provided Address.
          </div>
			</div>) : (<div>	
			<FormGroup>
				<FormGroup>
					<FormControl 
					 type="name"
					 input="text"
					 value={this.state.name}
					 placeholder="Department Name"
					 onChange={this.onNameChange}
					/>
				</FormGroup>
				<FormGroup>
					<FormControl 
					 type="email"
					 input="text"
					 value={this.state.email}
					 placeholder="Email address"
					 onChange={this.onEmailChange}
					/>
				</FormGroup>
				<FormGroup>
					<FormControl 
					 type="password"
					 input="text"
					 value={this.state.password}
					 placeholder="Password"
					 onChange={this.onPasswordChange}
					/>
				</FormGroup>
				<FormGroup>
					<FormControl 
					 type="password"
					 input="text"
					 value={this.state.confirmPassword}
					 placeholder="Password"
					 onChange={this.onConfirmPasswordChange}
					/>
				</FormGroup>
				<Button bsStyle="danger" onClick={this.onFormSubmit}> Request </Button>
			</FormGroup>
			</div>)
		}
		</div>
		)
		}
	}
