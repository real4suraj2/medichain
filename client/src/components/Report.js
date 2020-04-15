import React,{ Component } from 'react';
import QrReader from 'react-qr-reader';
import { Editor } from '@tinymce/tinymce-react'; 

import {Button, FormGroup, FormControl, ListGroup, ListGroupItem} from 'react-bootstrap';

export default class Report extends Component {
	state = {
		report : '',
		view : false,
		share : false,
		receiverAddress : '',
		showScanner : false,
		text : ''
		}
	constructor(props){
		super(props);
	}
	componentDidMount(){ 
		this.setState({
			report : this.props.report,
			text : this.props.report.description
		})
		}
	toggleView = () => {
		this.setState({view : !this.state.view});
		}
	toggleShare= () => {
		this.setState({share : !this.state.share});
		}
	onReceiverAddressChange= event=> {
		this.setState({receiverAddress : event.target.value})
		}
	onFormSubmit = event=> {
		const {report, receiverAddress} = this.state;
		this.props.onhandleShare(report,receiverAddress);
		}
	toggleQrScan = ()=> {
		this.setState({showScanner : !this.state.showScanner});
		}
	  handleScan = data => {
		if (data) {
		  this.setState({receiverAddress: data});
		}
	  }
	  handleError = err => {
		console.log(err);
	  }
	  handleEditorChange = event =>{
			this.setState({text : event});
		}
	render(){
		const {report,receiverAddress} = this.state;
		return(
		<div>
			{this.state.view ? (
			<div className="card-maker Block black">
					<div className="card-body">
						  <div className="card-title black">Title : {report.title}</div>
						  <div className="card-subtitle mb-2 black">Id : {report.id}</div>
						  <div className="card-text">
							  <ListGroup classNamae="list-show">
								<ListGroupItem>Departments : {report.departments} </ListGroupItem>
								<ListGroupItem>Medications : {report.medications} </ListGroupItem>
								<ListGroupItem>Prescriptions : {report.prescriptions} </ListGroupItem>
								<ListGroupItem>
								<div>Description
								 <Editor
								value={this.state.text}
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
								onEditorChange={this.handleEditorChange}
								disabled={true}
								/>
								</div></ListGroupItem>
								<ListGroupItem>From : {report.from} </ListGroupItem>
							  </ListGroup>
						</div>
					</div>
			</div>
				) : (
				<div className="card-maker Block black">
				<p> Title : {report.title} </p>
				<p> Id : {report.id} </p>
				</div>
				)}
			{this.state.share ? (
				<FormGroup>
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
						input="text"
						placeholder="Receiving Department Address"
						value={this.state.receiverAddress}
						onChange={this.onReceiverAddressChange}
					/>
				</FormGroup>
				<Button bsStyle="danger" onClick={this.toggleQrScan}> {this.state.showScanner ? 'Cancel' : 'Scan QR'}</Button>
				<Button bsStyle="danger" onClick={this.onFormSubmit}> Share </Button>
				</FormGroup>
				) : ('')}
			<Button bsStyle="danger" onClick={this.toggleView}>{this.state.view ? ('View less') : ('View')}</Button>
			<Button bsStyle="danger" onClick={this.toggleShare}>{this.state.share ?('Cancel') : ('Share')}</Button>
			
		</div>
		)
		}
	
	}
