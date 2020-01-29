import React, {Component} from 'react';
import {Button, ListGroupItem, ListGroup} from 'react-bootstrap';
export default class Bio extends Component {
		state = { bio : {}, kind : '', view : false, name : '' }
		constructor(props){
			super(props);
			}
		componentDidMount(){
			const {bio, kind, name} = this.props;
			this.setState({bio,kind,name});
			}
		componentWillReceiveProps(nextProps){
			this.setState({bio : nextProps.bio, kind : nextProps.kind, name : nextProps.name});
			}
		toggleView = () => {
		this.setState({view : !this.state.view});
		}
		render(){
			const {bio,kind,name,view} = this.state;
			
			return(
			<div>
			{ 
				(view && kind === 'patient') ? (
								<div>
									<div className="card">
										<div className="card-body">
											  <div className="card-title">BIO</div>
											  <div className="card-text">
												  <ListGroup>
													<ListGroupItem className="active">Name : {name} </ListGroupItem>
													<ListGroupItem className="active">Sex : {bio.sex} </ListGroupItem>
													<ListGroupItem className="active">DOB : {bio.dob} </ListGroupItem>
												  </ListGroup>
											  </div>
										</div>
									</div>
								</div>
					
					) : (<div> </div>)	
			}
			{
				(view && kind === 'department') ? (
								<div>
									<div className="card">
										<div className="card-body">
											  <div className="card-title">BIO</div>
											  <div className="card-text">
												  <ListGroup>
													<ListGroupItem className="active">Department Name : {name} </ListGroupItem>
													<ListGroupItem className="active">Type: {bio.departmentType} </ListGroupItem>
													<ListGroupItem className="active">Facilitites : {bio.departmentFacilities} </ListGroupItem>
												    <ListGroupItem className="active">Location: {bio.departmentLocation} </ListGroupItem>
												    <ListGroupItem className="active">Issuer: {bio.issuer} </ListGroupItem>
												  </ListGroup>
											  </div>
										</div>
									</div>
								</div>
				) : (<div> </div>)
			}
				<div>
					<Button bsStyle="danger" onClick={this.toggleView}>{this.state.view ? ('Hide Bio') : ('Show Bio')}</Button>
				</div>
				</div>
				)
				}
	}
