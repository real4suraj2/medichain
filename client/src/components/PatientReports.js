import React, {Component} from 'react';
import PatientReport from './PatientReport';

export default class PatientReports extends Component {
		state = { patientReports : [] }
		constructor(props){
			super(props);
			}
		componentDidMount(){
			this.setState({patientReports : this.props.patientReports});
			}
		componentWillReceiveProps(nextProps){
			this.setState({patientReports : nextProps.patientReports});
			}
		shouldComponentUpdate(nextProps) {
			return this.state.patientReports.length !== nextProps.patientReports.length;
		}
		render(){
			const reports = this.state.patientReports;
			return(
				<div>
					{ reports.map(report => (<PatientReport patientReport={report} key={'patient' + report.id} />)) }
				</div>
			)
			}
	}
