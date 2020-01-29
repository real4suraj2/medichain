import React,{ Component } from 'react';
import QrReader from 'react-qr-reader';
import {Button, FormGroup, FormControl, ListGroup, ListGroupItem} from 'react-bootstrap';

export default class Report extends Component {
	state = {
		report : '',
		view : false,
		share : false,
		receiverAddress : '',
		showScanner : false
		}
	constructor(props){
		super(props);
	}
	componentDidMount(){ 
		this.setState({
			report : this.props.report
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
	render(){
		const {report,receiverAddress} = this.state;
		return(
		<div>
			{this.state.view ? (
			<div className="card">
					<div className="card-body">
						  <div className="card-title">{report.title}</div>
						  <div className="card-subtitle mb-2 text-muted">{report.id}</div>
						  <div className="card-text">
							  <ListGroup>
								<ListGroupItem className="active">Departments : {report.departments} </ListGroupItem>
								<ListGroupItem className="active">Medications : {report.medications} </ListGroupItem>
								<ListGroupItem className="active">Prescriptions : {report.prescriptions} </ListGroupItem>
								<ListGroupItem className="active">Description : {report.description} </ListGroupItem>
								<ListGroupItem className="active">From : {report.from} </ListGroupItem>
							  </ListGroup>
						</div>
					</div>
			</div>
				) : (
				<div>
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
