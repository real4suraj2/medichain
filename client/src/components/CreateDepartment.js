import React, { Component } from 'react';
import QrReader from 'react-qr-reader';
import {FormGroup, FormControl, Button} from 'react-bootstrap';
import { css } from "@emotion/core";
import { CircleLoader } from "react-spinners";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  background-color : transparent;
`;


export default class CreateDepartment extends Component {
	state = {
		publicKey : '',
		departmentType : '',
		departmentFacilities : '',
		departmentLocation : '',
		issuer : '',
		adminKey : '',
		showScanner : false
		}
	constructor(props){
		super(props);
		}
	onPublicKeyChange = event => {
		this.setState({publicKey : event.target.value});
		}
	onDepartmentTypeChange = event => {
		this.setState({departmentType : event.target.value});
		}
	onDepartmentFacilitiesChange = event => {
		this.setState({departmentFacilities : event.target.value});
		}
	onDepartmentLocationChange = event => {
		this.setState({departmentLocation : event.target.value});
		}
	onIssuerChange = event => {
		this.setState({issuer : event.target.value});
		}
	onAdminKeyChange = event =>{
		this.setState({adminKey : event.target.value});
		}
	onFormSubmit = event => {
		const {publicKey, departmentType, departmentFacilities, departmentLocation, issuer,adminKey} = this.state;
		fetch(`${document.location.origin}/api/validate`,{
			method : 'POST',
			headers : {'Content-Type':'application/json','x-auth':adminKey},
			body : JSON.stringify({
				publicKey, departmentType, departmentFacilities, departmentLocation, issuer 
				})
			})
			.then(res => res.json())
			.then(json =>console.log(json));
		}
	toggleQrScan = ()=> {
		this.setState({showScanner : !this.state.showScanner});
		}
    handleScan = data => {
		if (data) {
		  this.setState({publicKey: data,showScanner : false});
		}
    }
	handleError = err => {
		console.log(err);
    }
	render(){
	return(
	<div>
		<FormGroup>
				
				<FormGroup>
					<FormControl
						input = "text"
						placeholder = "Department Type"
						value = {this.state.departmentType}
						onChange = {this.onDepartmentTypeChange}
					/>
				</FormGroup>
				<FormGroup>
					<FormControl
						input = "text"
						placeholder = "Department Facilities"
						value = {this.state.departmentFacilities}
						onChange = {this.onDepartmentFacilitiesChange}
					/>
				</FormGroup>
				<FormGroup>
					<FormControl
						input = "text"
						placeholder = "Department Location"
						value = {this.state.departmentLocation}
						onChange = {this.onDepartmentLocationChange}
					/>
				</FormGroup>
				<FormGroup>
					<FormControl
						input = "text"
						placeholder = "Issued By"
						value = {this.state.issuer}
						onChange = {this.onIssuerChange}
					/>
				</FormGroup>
				<FormGroup>
					<FormControl
						input = "text"
						placeholder = "Admin Key"
						value = {this.state.adminKey}
						onChange = {this.onAdminKeyChange}
					/>
				</FormGroup>
				{
				this.state.showScanner ? (
				<div className="make-modal">
					<QrReader
						delay={300}
						onError={this.handleError}
						onScan={this.handleScan}
						style={{ width: '100' }}
					/>
				</div>
				) : (<div></div>)
				}
				<FormGroup>
					<FormControl
						input = "text"
						placeholder = "publicKey"
						value = {this.state.publicKey}
						onChange = {this.onPublicKeyChange}
					/>
				</FormGroup>
				<Button bsStyle="danger" onClick={this.toggleQrScan}> {this.state.showScanner ? 'Cancel' : 'Scan QR'}</Button>
				<Button bsStyle="danger" onClick={this.onFormSubmit} > Submit </Button>	
            </FormGroup>
	</div>
	)
	}
	
	}
