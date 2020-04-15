import React,{Component} from 'react';
import {FormGroup,FormControl, Button} from 'react-bootstrap';
import history from '../history';
import logo from '../assets/logo2.jpg';
import { css } from "@emotion/core";
import { CircleLoader } from "react-spinners";
import {Link} from "react-router-dom"
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  background-color : transparent;
`;


export default class Login extends Component {
	state = {password : '',email : '',message:'',loading : false}
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
		this.setState({loading : true});
		fetch(`${document.location.origin}/api/login`, {
			  method: 'POST',
			  headers: { 'Content-Type': 'application/json' },
			  body: JSON.stringify({ email, password })
		})
		.then(res => res.json())
		.then(json =>{
			this.setState({loading : false});
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
            <div className="signUp">
				<div>
					<img src={logo} className="logo logo-form"/>
				</div>
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
				<Button bsStyle="danger" className="danger-full" onClick={this.onFormSubmit} > Submit </Button>
				<p style={{marginTop:15}}>Don't have an account ?</p>
				<Link style={{textDecoration:'none',marginTop :2}} className="btn btn-danger" to ="/signup"> Sign Up </Link>
				
            </FormGroup>
            </div>
        )
		}
	}
