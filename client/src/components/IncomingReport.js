import React,{ Component } from 'react';
import {Button, ListGroup, ListGroupItem} from 'react-bootstrap';

export default class IncomingReport extends Component {
	state = {
		incomingReport : ''
		}
	constructor(props){
		super(props);
		
	}
	componentDidMount(){ 
		this.setState({
			incomingReport : this.props.incomingReport
		})
		}
	onAccept = event =>{
		const report = this.state.incomingReport;
		this.props.onhandleShare(report,'self');
		}
	onReject = event =>{
		
		}
	render(){
		const {id, departments, medications, prescriptions, description, receiver, title, from} = this.state.incomingReport;
		return(
			<div>
				<div className="card">
					<div className="card-body">
						  <div className="card-title">{title}</div>
						  <div className="card-subtitle mb-2 text-muted">{id}</div>
						  <div className="card-text">
							  <ListGroup>
								<ListGroupItem className="active">Departments : {departments} </ListGroupItem>
								<ListGroupItem className="active">Medications : {medications} </ListGroupItem>
								<ListGroupItem className="active">Prescriptions : {prescriptions} </ListGroupItem>
								<ListGroupItem className="active">Description : {description} </ListGroupItem>
								<ListGroupItem className="active">From : {from} </ListGroupItem>
							  </ListGroup>
						  </div>
					</div>
				</div>
				<div>
					<Button bsStyle="danger" onClick={this.onAccept}> Accept </Button>
				</div>
			</div>
		)
		}
	
	}
