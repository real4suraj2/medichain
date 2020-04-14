import React,{ Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
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
		<Scrollbars style={{ height: 300 }}>
			{ reports.map(r =>( <Report report={r} key={r.id} onhandleShare={this.props.onShare} />)) }
		</Scrollbars>
		)
		}
	
	}
