import React,{Component} from 'react';
import {FormGroup,FormControl, Button} from 'react-bootstrap';
import history from '../history';


export default class Login extends Component {
	state = {password : '',email : '',message:''}
	constructor(props) {
		super(props);
		}
	onPasswordChange = event =>{
		this.setState({password : event.target.value});
		}
	onEmailChange = event => {
		this.setState({email : event.target.value});
		}
	onFormSubmit = event => {
		const {email,password} = this.state;
		fetch(`${document.location.origin}/api/login`, {
			  method: 'POST',
			  headers: { 'Content-Type': 'application/json' },
			  body: JSON.stringify({ email, password })
		})
		.then(res => res.json())
		.then(json =>{
			if(json.authenticated === "true"){
				history.push({ pathname : '/',state: {publicKey : json.publicKey, privateKey : json.privateKey, kind : json.kind} });
				}
			else{
				this.setState({message : json.kind});
				}
			})
		}
		render() {
        return (
            <div>
            <div>{this.state.message}</div>
            <FormGroup>
				<FormGroup>
					<FormControl
						type = "email"
						input = "text"
						placeholder = "Email"
						value = {this.state.email}
						onChange = {this.onEmailChange}
					/>
				</FormGroup>
				<FormGroup>
					<FormControl
						type = "password"
						input = "text"
						placeholder = "password"
						value = {this.state.password}
						onChange = {this.onPasswordChange}
					/>
				</FormGroup>
				<Button bsStyle="danger" onClick={this.onFormSubmit} > Submit </Button>
				
            </FormGroup>
            </div>
        )
		}
	}
