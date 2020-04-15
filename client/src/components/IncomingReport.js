import React,{ Component } from 'react';
import { Editor } from '@tinymce/tinymce-react'; 
import {Button, ListGroup, ListGroupItem} from 'react-bootstrap';

export default class IncomingReport extends Component {
	state = {
		incomingReport : '',
		text : ''
		}
	constructor(props){
		super(props);
		
	}
	componentDidMount(){ 
		this.setState({
			incomingReport : this.props.incomingReport,
			text : this.props.incomingReport.description
		})
		}
	onAccept = event =>{
		const report = this.state.incomingReport;
		this.props.onhandleShare(report,'self');
		}
	handleEditorChange = event =>{
			this.setState({text : event});
		}
	render(){
		const {id, departments, medications, prescriptions, description, receiver, title, from} = this.state.incomingReport;
		return(
			<div>
				<div className="card-maker Block">
					<div className="card-body">
						  <div className="card-title black">Title : {title}</div>
						  <div className="card-subtitle mb-2 black">Id : {id}</div>
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
								onEditorChange={this.handleEditorChange}
								disabled={true}
								/>
								</div></ListGroupItem>
								<ListGroupItem>From : {from} </ListGroupItem>
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
