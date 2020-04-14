import React,{ Component } from 'react';
import {ListGroup, ListGroupItem} from 'react-bootstrap';


export default class SharedReport extends Component {
	state = {
		id : '',
		to : []
		}
	constructor(props){
		super(props);
		
	}
	componentDidMount(){ 
		this.setState({
			id : this.props.rid,
			to : this.props.rto
		})
		}
	render(){
		const {id,to} = this.state;
		return(
		<div className="card-maker Block">
		<ListGroup className="list-show">
			<ListGroupItem>Id : {id}</ListGroupItem>
			<ListGroupItem> {'<------------With---------->'} </ListGroupItem>
			{
			to.map(address=>(<ListGroupItem>{address}</ListGroupItem>))
			}
		</ListGroup>
		</div>
		)
		}
	
	}
