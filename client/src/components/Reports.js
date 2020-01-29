import React,{ Component } from 'react';
import Report from './Report';

export default class Reports extends Component {
	state = {
		reports : []
		}
	constructor(props){
		super(props);
	}
	componentDidMount(){ 
		this.setState({
			reports : this.props.reports
		})
		}
	componentWillReceiveProps(nextProps) {
		this.setState({reports: nextProps.reports});
	}
	shouldComponentUpdate(nextProps) {
		return this.state.reports.length !== nextProps.reports.length;
	}
	render(){
		const reports = this.state.reports;
		return(
		<div>
			{ reports.map(r =>( <Report report={r} key={r.id} onhandleShare={this.props.onShare} />)) }
		</div>
		)
		}
	
	}
