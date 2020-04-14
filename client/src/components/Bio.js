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
											  <div className="card-text">
												  <ListGroup className="list-show">
													<ListGroupItem>Name : {name} </ListGroupItem>
													<ListGroupItem>Sex : {bio.sex} </ListGroupItem>
													<ListGroupItem>DOB : {bio.dob} </ListGroupItem>
												  </ListGroup>
											  </div>
										</div>
									</div>
								</div>
					
					) : (<div> </div>)	
			}
			{
				(view && kind === 'department') ? (
								<div className="bio">
									<div className="card">
										<div className="card-body">
											  <div className="card-text">
												  <ListGroup className="list-show">
													<ListGroupItem>Department Name : {name} </ListGroupItem>
													<ListGroupItem>Type: {bio.departmentType} </ListGroupItem>
													<ListGroupItem>Facilitites : {bio.departmentFacilities} </ListGroupItem>
												    <ListGroupItem>Location: {bio.departmentLocation} </ListGroupItem>
												    <ListGroupItem>Issuer: {bio.issuer} </ListGroupItem>
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
