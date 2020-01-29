import React,{ Component } from 'react';
import SharedReport from './SharedReport';

export default class Reports extends Component {
	state = {
		sharedReports : {}
		}
	constructor(props){
		super(props);
	}
	componentDidMount(){ 
		this.setState({
			sharedReports : this.props.sharedReports
		})
		}
	componentWillReceiveProps(nextProps) {
		this.setState({sharedReports: nextProps.sharedReports});
	}
	shouldComponentUpdate(nextProps) {
		return Object.keys(this.state.sharedReports).length !== Object.keys(nextProps.sharedReports).length;
	}
	render(){
		const reports = this.state.sharedReports;
		const ids = Object.keys(reports);
		ids.forEach(id => console.log(reports[id]));
		return(
		<div>
		{
			ids.map(id=>{
				const to = reports[id];
				const key = 'shared' + id + Date.now();
				return (<SharedReport rid = {id} rto={to} key={key}/>);
			})
		}
		</div>
		)
		}
	
	}
