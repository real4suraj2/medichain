import React, {Component} from 'react';

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
			console.log(departments);
			return(
				<div>
					{ departments.map(department => (
						<div className="card">
							<div className="card-body">
								<div className="card-title">Department Address</div>
								<div className="card-subtitle mb-2 text-muted">Address : {department}</div>							
							</div>
						</div>
						)
						) }
				</div>
			)
			}
	}
