import React, {Component} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

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
				<Scrollbars style={{ height: 300 }}>
					{ reports.map(report => (<PatientReport patientReport={report} key={'patient' + report.id} />)) }
				</Scrollbars>
			)
			}
	}
