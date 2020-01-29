const uuid = require('uuid/v1');
const {verifySignature} = require('../util');


class Transaction {
   constructor({ senderLedger, receiver, report, outputMap, input, by }) {
	 this.id = uuid();
	 this.outputMap = outputMap || this.createOutputMap({senderLedger, receiver, report, by});
	 this.input = input || this.createInput({senderLedger , outputMap : this.outputMap });   
  }
  
  createOutputMap({senderLedger, receiver, report, by}) {
    const outputMap = {};
    
    outputMap[receiver] = [report];  
    outputMap.to = receiver;
    outputMap.by = by;
 
    return outputMap;
  }
  
  createInput({senderLedger, outputMap}) {
	 return {
		 timestamp: Date.now(),
		 address: senderLedger.publicKey,
		 signature: senderLedger.sign(outputMap)
	 };
  }
  
  update({senderLedger, receiver, report, by}){
    if (!this.outputMap[receiver]) {
      this.outputMap[receiver] = [report];
      this.outputMap.to = receiver;
      this.outputMap.by = by;
    } else {
	  let flag = false;
	  this.outputMap[receiver].forEach(r =>{
		  if(r.id == report.id) {
			  flag = true;
			  }
		  })
	  if(!flag)
		this.outputMap[receiver] = [...this.outputMap[receiver],report];
    }
	
	this.input = this.createInput({senderLedger, outputMap : this.outputMap });
  }
  
  static validTransaction(transaction) {
	 const {input : { address, signature} , outputMap }  = transaction;  
		 
	 if (!verifySignature({publicKey : address, data: outputMap, signature })) {
	   console.error(`Invalid signature from ${address}`);
	   return false;
	 }
	 
	 return true;
  }	
  

}

module.exports = Transaction;
