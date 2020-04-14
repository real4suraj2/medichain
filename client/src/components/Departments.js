import React, {Component} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

export default class PatientReports extends Component {
		state = { departments : [] }
		constructor(props){
			super(props);
			}
		componentDidMount(){
			this.setState({departments : this.props.departments});
			}
		componentWillReceiveProps(nextProps){
			this.setState({departments : nextProps.departments});
			}
		shouldComponentUpdate(nextProps) {
			return this.state.departments.length !== nextProps.departments.length;
		}
		render(){
			const departments = this.state.departments;
			return(
			<div className="department-list black">
				<Scrollbars
					style={{ height: 300 }}>
						{ departments.map(department => (<p className="card-maker Block">Address {department} </p>)) }
				</Scrollbars>
			</div>
			)
			}

	}
