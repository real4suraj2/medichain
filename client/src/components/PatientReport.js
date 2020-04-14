import React, {Component} from 'react';
import { Editor } from '@tinymce/tinymce-react'; 

import {Button, ListGroup, ListGroupItem} from 'react-bootstrap';

export default class PatientReport extends Component {
		state = { patientReport : '', view : false,text: '' }
		constructor(props){
			super(props);
			}
		componentDidMount(){
			this.setState({patientReport : this.props.patientReport, text : this.props.patientReport.description});
			}
		onToggleView = event=> {
			this.setState({view : !this.state.view});
			}
		handleEditorChange = event =>{
			this.setState({text : event});
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
			<div className="card-maker Block">
				<div className="card-body">
					<div className="card-title black">Title : {title}</div>
					<div className="card-subtitle mb-2 black">Id : {id}</div>
					{
						view ? (
						<div className="card-text">
							<ListGroup className="list-show">
								<ListGroupItem>Departments : {departments} </ListGroupItem>
								<ListGroupItem>Medications : {medications} </ListGroupItem>
								<ListGroupItem>Prescriptions : {prescriptions} </ListGroupItem>
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
								disabled={true}
								onEditorChange={this.handleEditorChange}
								/>
								</div></ListGroupItem>
								<ListGroupItem>From : {from} </ListGroupItem>
							</ListGroup>
						</div> ) : ('')
					}
					<Button bsStyle="danger" onClick={this.onToggleView}>{ view ? 'View less' : 'View'}</Button>
				</div>
			</div>
			)
			}
	}
