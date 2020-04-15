import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'react-google-qrcode';
import QrReader from 'react-qr-reader'
import {Button, Tabs, Tab} from 'react-bootstrap';

import logoMain from '../assets/logoMain.jpg';
import logoAdmin from '../assets/setting.png';
import logoPatient from '../assets/logoUser.jpg';
import logoDepartment from '../assets/logoDepartment.jpg';
import { LATENCY_DELAY, POLL_INTERVAL } from '../config';

import Reports from './Reports';
import SharedReports from './SharedReports';
import IncomingReports from './IncomingReports';

import PatientReports from './PatientReports';
import GenerateReport from './GenerateReport';

import CreateDepartment from './CreateDepartment';
import Departments from './Departments';

import Bio from './Bio';

class App extends Component {
  state = { publicKey : '', privateKey : '',reports : [], sharedReports : [], incomingReports : [], kind: '',patientReports : [],validDepartments :[],bio :{}, name :'',showQR : false};
  constructor(props){
	  super(props);
	  }
  componentDidMount(){
	  const {publicKey, privateKey, kind} = this.props.location.state;
	  this.setState({publicKey, privateKey, kind});
	  this.syncInterval = setInterval(()=>this.fetchData(), POLL_INTERVAL);
	  setTimeout(this.fetchData(), LATENCY_DELAY);
	  
	  }
	  
  componentWillUnmount(){
	  clearInterval(this.syncInterval);
	  }
  fetchData(){
	  const {publicKey, privateKey, kind} = this.state;
	  if(kind === 'non-validated') {
		  clearInterval(this.syncInterval);
		  return;
		  }
	  fetch(`${document.location.origin}/api/ledger-info`,{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({publicKey, privateKey, kind})
		})
		.then(res=>res.json())
		.then(json=>{
		if(kind === 'patient') {
			const {reports, sharedReports, incomingReports, bio, name} = json;
			return this.setState({reports, sharedReports, incomingReports, bio, name});
		}
		else if(kind === 'department') {
			const {patientReports, bio, name} = json;
			return this.setState({patientReports, bio, name});
			}
		else if(kind === 'admin') {
			const {validDepartments} = json;
			return this.setState({validDepartments});
			}
		 });
	  }
	onShare(report,receiverAddress){
		const {privateKey, publicKey} = this.state;
		if(receiverAddress === "self")
			receiverAddress = publicKey
		fetch(`${document.location.origin}/api/transact`,{
			  method: 'POST',
			  headers: { 'Content-Type': 'application/json' },
			  body: JSON.stringify({ 
				  privateKey,
				  publicKey,
				  by:"patient",
				  report,
				  receiver:receiverAddress
				})
			})
			.then(res=>res.json())
			.then(json=> console.log(json))
		}
	
  toggleQR = ()=> {
	  this.setState({showQR : !this.state.showQR});
	  }

  render() {
    const address = this.state.publicKey;
    const {privateKey, kind}= this.state;
	let logo;
	if(kind ==='admin') logo = logoAdmin;
	else if(kind === 'department') logo = logoDepartment;
	else if(kind === 'patient') logo = logoPatient;
	else logo = logoMain;
    return (
      <div className='App'>
        <div>
			{this.state.showQR ?( 
		  <QRCode
            data={address}
            size={350}
            framed
          />) : (<img className='logo' src={logo}></img>)}
		</div>
        {kind === 'admin' ? (<div></div>) : (<Bio  bio={this.state.bio} name={this.state.name} kind={kind} />)}
        <br />
        {
        (kind === 'admin') ? (<Tabs defaultActivateKey = "departments" transition={true} className="card-maker card-rectify Block black tabs-sanitize">
			<Tab eventKey = "departments" title="Valid Departments" >
				<div>
					<Departments departments={this.state.validDepartments}/>
				</div>
			</Tab>
			<Tab eventKey = "createDepartment" title="Create Department">
				<div>
					<CreateDepartment />
				</div>
			</Tab>
			</Tabs>) : (
			<div className='LedgerInfo'>
				<div className="black card-maker card-rectify">Address: {address}</div>
				<Button bsStyle="danger mb-2 mt-2" onClick={this.toggleQR} >{this.state.showQR ? 'Hide QR' : 'Show QR'}</Button>
			</div>)
		}
        {
			(address && kind === 'patient') ? (<Tabs defaultActivateKey = "reports" transition={true}  className="card-maker card-rectify Block black tabs-sanitize">
				<Tab eventKey = "reports" title="Reports" >
				<div>
					<Reports reports={this.state.reports} onShare={this.onShare.bind(this)}/>
				</div>
				</Tab>
				<Tab eventKey = "sharedReports" title="Shared Reports" >
				 <div>
					<SharedReports sharedReports={this.state.sharedReports} />
				</div>
				</Tab>
				<Tab eventKey = "incomingReports" title="Incoming Reports" >
				<div>
					<IncomingReports incomingReports={this.state.incomingReports} onShare={this.onShare.bind(this)} />
				</div>
				</Tab>
			</Tabs>) : (<div></div>)
		}
        {
			(address && kind === "department") ? (<Tabs defaultActivateKey = "patientReports" transition={true}  className="card-maker card-rectify Block black tabs-sanitize">
				<Tab eventKey = "patientReports" title="Patient Reports" >
					<div className="cover">
						<PatientReports patientReports={this.state.patientReports} />
					</div>
				</Tab>
				<Tab eventKey = "incomingReports" title="Generate Reports" >
					<div>
						<GenerateReport publicKey={address} privateKey={privateKey} />
					</div>
				</Tab>
			</Tabs>) : (<div></div>)
		}
		{
		(kind === 'non-validated') ? <div> <strong>Department not verified</strong> !! Please verify your account now !! </div> : <div></div>
		}
        <br />
      </div>
    );
  }
}

export default App;
