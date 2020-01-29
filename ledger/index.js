const Transaction = require('./transaction');
const { ec, cryptoHash } = require('../util');

class Ledger {
  constructor(data) {
    this.reports = [];
    this.sharedReports = {};
    this.incomingReports = [];
    this.keyPair = ec.keyFromPrivate(data.privateKey);
	this.publicKey = data.publicKey;
  }
  
  sign(data) {
	 if(this.keyPair.getPublic('hex') !== this.publicKey) {
		 throw new Error("Access Denied !!");
		 }
    return this.keyPair.sign(cryptoHash(data))
  }
 
  createTransaction({ receiver, report, chain, by }) {
    if (chain) {
      this.reports = Ledger.getReports({
        chain,
        address: this.publicKey
      });
      this.sharedReports = Ledger.getSharedReports({
		  chain,
		  address : this.publicKey
		  });
	  this.incomingReports = Ledger.getIncomingReports({
		  chain,
		  address : this.publicKey
		  })
		}
    return new Transaction({ senderLedger: this, receiver, report, by });
  }
  
  static getBio({chain, address}) {
	  let bio = {};
	  let flag = false;
	  for(let i = chain.length - 1; i > 0; i--){
		  const block = chain[i];
		  for(let j = 0; j < block.data.length; j++){
			  const transaction = block.data[j];
			  if(transaction.outputMap.to === address && transaction.input.address === address){
				  for(let k = 0; k < transaction.outputMap[address].length; k++){
						let report = transaction.outputMap[address][k];
						if(report.id === 'bio'){
							bio = report;
							flag = true;
							break;
							}
				  }
			  }
			  if(flag) break; 
		}
		if(flag) break;
	 }
	  return bio;
  }
	
  static getReports({ chain, address }) {
    let reports = [];
    for (let i=chain.length-1; i> 0; i--) {
      const block = chain[i];
      for (let transaction of block.data) {
        if (transaction.outputMap.to == address && transaction.input.address === address) {
				  reports.push(...transaction.outputMap[address]);    
          }
	  }
      }
      let ids = {};
    return reports.filter(report =>{
		if(report.id === 'bio' || ids[report.id])
			return false;
			ids[report.id] = true;
			return true;
		});
    }
    
    static getSharedReports({ chain, address }) {
		let sharedReports = {};
		let flag = false;
		for(let i = chain.length - 1; i > 0; --i){
			const block = chain[i];
			for(let transaction of block.data) {
				if(transaction.outputMap.to !== address && transaction.input.address === address ) {
					transaction.outputMap[transaction.outputMap.to].forEach(report => {
						if(!sharedReports[report.id])
							sharedReports[report.id] = [transaction.outputMap.to];
						else{
							sharedReports[report.id].forEach(receiverAddress =>{
								if(receiverAddress == transaction.outputMap.to)
										flag = true;
								})
								if(!flag)
									sharedReports[report.id].push(transaction.outputMap.to);
							}
						});
					}
				}
			}
			
			return sharedReports;
		}
	
	static getPatientReports({chain, address}){
		let patientReports = [];
		let ids = {};
		for(let i = chain.length - 1; i > 0; --i) {
			const block = chain[i];
			for(let transaction of block.data) {
				let validAddress = '';
				if(transaction.outputMap.to === address) {
					validAddress = address;
				}
				else if(transaction.input.address === address) {
					validAddress = transaction.outputMap.to; 
				}
				if(validAddress){
					transaction.outputMap[validAddress].forEach(report=>{
						if(!ids[report.id] && report.id !== 'bio'){
							ids[report.id] = true;
							patientReports.push(report);
						}
					})
				}				
			}	
		}
		return patientReports;
	}

	
	 static getIncomingReports({chain, address}){
		let incomingReports = [];
		let ids = {};
		let flag;
		for(let i = chain.length - 1; i > 0; --i){
			const block = chain[i];
			for(let transaction of block.data) {
				if(transaction.outputMap.to == address && transaction.outputMap.by == "department" && transaction.input.address != address) {	
								transaction.outputMap[address].forEach(report=>{
									if(!ids[report.id]){
										ids[report.id] = true;
										incomingReports.push(report);
										}
									})
				}
			}
		}
			const reportsCopy = this.getReports({chain, address});
			return incomingReports.filter(report =>{
				flag = false;
				reportsCopy.forEach(r => {
					if(r.id === report.id) {
						flag = true;
						}
					});
				if(flag){
					return false;
					}
				return true;
				});
	}
}


module.exports = Ledger;
