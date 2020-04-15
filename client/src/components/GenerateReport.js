import React, { Component } from 'react';
import QrReader from 'react-qr-reader';
import { Editor } from '@tinymce/tinymce-react'; 
import {FormGroup,FormControl, Button} from 'react-bootstrap';


export default class GenerateReport extends Component {
	state = {title:'',departments:'',medications:'',prescriptions:'',description : '',publicKey : '', privateKey : '',receiver : '',showScanner : false, loading:true}
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
	onDescriptionChange = event => { this.setState({description: event.target.getContent()}) }
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
			.then(json=> this.setState({loading : false}));
	}
	toggleQrScan = ()=> {
		this.setState({showScanner : !this.state.showScanner});
		}
    handleScan = data => {
		if (data) {
		  this.setState({receiver: data, showScanner : false});
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
					      <Editor
								initialValue="<p>Description</p>"
								apiKey="glhj4y8xn7gjz34qqykxe2ajrdalxl0r40efi9vblmakz35f"
								init={{
								  height: 500,
								  menubar: false,
								  plugins: [
									'advlist autolink lists link image', 
									'charmap print preview anchor help',
									'searchreplace visualblocks code',
									'insertdatetime media table paste wordcount'
								  ],
								  toolbar:
									'undo redo | formatselect | bold italic | \
									alignleft aligncenter alignright | \
									bullist numlist outdent indent | help'
								}}
								onChange={this.onDescriptionChange}
							/>
				</FormGroup>
				{
				this.state.showScanner ? (
				 <div className="make-modal">
					<QrReader
						delay={300}
						onError={this.handleError}
						onScan={this.handleScan}
						style={{ width: '100%' }}
					/>
				</div>
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
				<Button bsStyle="danger" className="mr-2" onClick={this.toggleQrScan}> {this.state.showScanner ? 'Cancel' : 'Scan QR'}</Button>
				<Button bsStyle="danger" onClick={this.onFormSubmit} > {this.state.loading ? 'Submit' : 'Shared'} </Button>	
            </FormGroup>
	
	
	</div>
	
	)
	}
	
	}
