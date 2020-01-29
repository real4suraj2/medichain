import React, { Component } from 'react';
import QrReader from 'react-qr-reader';
import {FormGroup,FormControl, Button} from 'react-bootstrap';


export default class GenerateReport extends Component {
	state = {title:'',departments:'',medications:'',prescriptions:'',description : '',publicKey : '', privateKey : '',receiver : '',showScanner : false}
	constructor(props){
		super(props);
		}
	componentDidMount(){
		this.setState({publicKey: this.props.publicKey, privateKey : this.props.privateKey })
		}
	onTitleChange = event => { this.setState({title : event.target.value}) }
	onDepartmentsChange = event => { this.setState({departments: event.target.value}) }
	onMedicationsChange = event => { this.setState({medications: event.target.value}) }
	onPrescriptionsChange = event => { this.setState({prescriptions: event.target.value}) }
	onDescriptionChange = event => { this.setState({description: event.target.value}) }
	onReceiverChange = event => {this.setState({receiver : event.target.value}) }
	onFormSubmit = event => { 
		const {title, publicKey, privateKey, departments, medications, prescriptions, description, receiver} = this.state;
		fetch(`${document.location.origin}/api/transact`,{
			  method: 'POST',
			  headers: { 'Content-Type': 'application/json' },
			  body: JSON.stringify({ 
				  privateKey,
				  publicKey,
				  by:"department",
				  report :{
					  id : Date.now(),
					  title,
					  departments,
					  medications,
					  prescriptions,
					  description,
					  from : publicKey
					  },
				  receiver
				})
			})
			.then(res=>res.json())
			.then(json=> console.log(json))
	}
	toggleQrScan = ()=> {
		this.setState({showScanner : !this.state.showScanner});
		}
    handleScan = data => {
		if (data) {
		  this.setState({receiver: data});
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
						placeholder = "Title"
						value = {this.state.title}
						onChange = {this.onTitleChange}
					/>
				</FormGroup>
				<FormGroup>
					<FormControl
						input = "text"
						placeholder = "Departments (comma separated)"
						value = {this.state.departments}
						onChange = {this.onDepartmentsChange}
					/>
				</FormGroup>
				<FormGroup>
					<FormControl
						input = "text"
						placeholder = "Medications and Treatments (comma separated)"
						value = {this.state.medications}
						onChange = {this.onMedicationsChange}
					/>
				</FormGroup>
				<FormGroup>
					<FormControl
						input = "text"
						placeholder = "Prescriptions (comma separated)"
						value = {this.state.prescriptions}
						onChange = {this.onPrescriptionsChange}
					/>
				</FormGroup>
				<FormGroup>
					<FormControl
						input = "text"
						placeholder = "Description"
						value = {this.state.description}
						onChange = {this.onDescriptionChange}
					/>
				</FormGroup>
				{
				this.state.showScanner ? (
				 <QrReader
					  delay={300}
					  onError={this.handleError}
					  onScan={this.handleScan}
					  style={{ width: '100%' }}
				/>
				) : (<div></div>)
				}
				<FormGroup>
					<FormControl
						input = "text"
						placeholder = "Receiver"
						value = {this.state.receiver}
						onChange = {this.onReceiverChange}
					/>
				</FormGroup>
				<Button bsStyle="danger" onClick={this.toggleQrScan}> {this.state.showScanner ? 'Cancel' : 'Scan QR'}</Button>
				<Button bsStyle="danger" onClick={this.onFormSubmit} > Submit </Button>	
            </FormGroup>
	
	
	</div>
	
	)
	}
	
	}
