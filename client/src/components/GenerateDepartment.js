import React, {Component} from 'react';
import QRCode from 'react-google-qrcode';

import {FormGroup, FormControl, Button} from 'react-bootstrap';

import { css } from "@emotion/core";
import { CircleLoader } from "react-spinners";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  background-color : transparent;
`;

export default class GenerateDepartment extends Component {
	state = {email: '', password: '', confirmPassword: '',name : '',message: '', loading : false}
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
		this.setState({loading : true});
		fetch(`${document.location.origin}/api/signUp`,{
			method : 'POST',
			headers : { 'Content-Type' : 'application/json' },
			body : JSON.stringify({email, password, confirmPassword, name, type : 'department'})
			})
		.then(res => res.json())
		.then(json => {
			this.setState({loading : false});
			this.setState({message: json.message});
			});
		
		}
	
	render(){
		const {message} = this.state;
		return(
		<div>
			{
			this.state.loading ? (<div className="sweet-loading">
					<CircleLoader
					  css={override}
					  size={150}
					  color={"#F71B56"}
					  loading={this.state.loading}
					/>
					</div>) : (<div></div>)
			}
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
			</div>) : (<div className="department-form">	
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
				<Button bsStyle="danger" className="danger-full" onClick={this.onFormSubmit}> Request </Button>
			</FormGroup>
			</div>)
		}
		</div>
		)
		}
	}
