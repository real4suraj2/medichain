import React, {Component} from 'react';
import {Button, ListGroup, ListGroupItem} from 'react-bootstrap';

export default class PatientReport extends Component {
		state = { patientReport : '', view : false }
		constructor(props){
			super(props);
			}
		componentDidMount(){
			this.setState({patientReport : this.props.patientReport});
			}
		onToggleView = event=> {
			this.setState({view : !this.state.view});
			}
		render(){
			const {id,
				   title,
				   departments,
				   medications,
				   prescriptions,
				   description,
				   from
			} = this.state.patientReport;
			const view = this.state.view;
			
			return(
			<div className="card">
				<div className="card-body">
					<div className="card-title">Title : {title}</div>
					<div className="card-subtitle mb-2 text-muted">Id : {id}</div>
					{
						view ? (
						<div className="card-text">
							<ListGroup>
								<ListGroupItem className="active">Departments : {departments} </ListGroupItem>
								<ListGroupItem className="active">Medications : {medications} </ListGroupItem>
								<ListGroupItem className="active">Prescriptions : {prescriptions} </ListGroupItem>
								<ListGroupItem className="active">Description : {description} </ListGroupItem>
								<ListGroupItem className="active">From : {from} </ListGroupItem>
							</ListGroup>
						</div> ) : ('')
					}
					<Button bsStyle="danger" onClick={this.onToggleView}>{ view ? 'View less' : 'View'}</Button>
				</div>
			</div>
			)
			}
	}
