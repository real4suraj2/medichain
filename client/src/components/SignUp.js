import React,{Component} from 'react';
import {Button} from 'react-bootstrap';

import GenerateDepartment from './GenerateDepartment';
import GeneratePatient from './GeneratePatient';

export default class SignUp extends Component {
	state = {kind : ''}
	constructor(props){
		super(props);
		}
	onKindChange = event => {
		this.setState({kind : event});
		}
    render() {
		const kind = this.state.kind;
        return (
        <div>
        {
		kind === '' ? (<div className="occupy">
			<Button bsStyle="danger" className="mb-1" onClick={()=>this.onKindChange('patient')} > Patient </Button>
			<Button bsStyle="danger" onClick={()=>this.onKindChange('department')} > Department </Button>
		 </div>) : (<div> 
		 {kind === 'department' ? <GenerateDepartment /> : <GeneratePatient />}
		 </div>)
        }
        {kind !== '' ? <Button bsStyle="danger" onClick={()=>this.onKindChange('')}> Cancel </Button> : <div></div>}
        </div>
        );
    }
}
