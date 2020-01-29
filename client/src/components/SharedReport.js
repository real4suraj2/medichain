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
		<div>
		<ListGroup>
			<ListGroupItem className="active">Id : {id}</ListGroupItem>
			<ListGroupItem className="active"> {'<------------With---------->'} </ListGroupItem>
			{
			to.map(address=>(<ListGroupItem className="active">{address}</ListGroupItem>))
			}
		</ListGroup>
		</div>
		)
		}
	
	}
