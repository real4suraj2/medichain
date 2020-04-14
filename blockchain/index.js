const Block = require('./block');
const Transaction = require('../ledger/transaction');
const Ledger = require('../ledger');
const {cryptoHash} = require('../util');

class Blockchain {
  constructor(){
    this.chain = [Block.genesis()];
  }
  
  addBlock({ data }) {
    const newBlock = Block.mineBlock({
      lastBlock: this.chain[this.chain.length-1],
      data
    });

    this.chain.push(newBlock);
  }
  
  replaceChain(chain,validateTransactions,onSuccess){
	if (chain.length <= this.chain.length) {
		return;
	}
	
	if(!Blockchain.isValidChain(chain)) {
		return;
	}
	
	if (validateTransactions && !this.validTransactionData({chain})) {
		return;
	}
	//if(onSucess) onSuccess();
	
	this.chain = chain;  
  }
  
  validTransactionData({ chain }) {
    for (let i=1; i<chain.length; i++) {
      const block = chain[i];
      const transactionSet = new Set();

      for (let transaction of block.data) {
          if (!Transaction.validTransaction(transaction)) {
            return false;
          }
		 /*
          const totalReports = Ledger.totalReports({
            chain: this.chain,
            address: transaction.input.address
          });

          if (transaction.input.reports.length !== totalReports) {
            return false;
          }
		*/
          if (transactionSet.has(transaction)) {
            return false;
          } else {
            transactionSet.add(transaction);
          }
        }
	}

    return true;
  }
  
  
static isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false
    };

    for (let i=1; i<chain.length; i++) {
      const { timestamp, lastHash, hash, nonce, difficulty, data } = chain[i];
      const actualLastHash = chain[i-1].hash;
      const lastDifficulty = chain[i-1].difficulty;

      if (lastHash !== actualLastHash) return false;

      const validatedHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);

      if (hash !== validatedHash) return false;

      if (Math.abs(lastDifficulty - difficulty) > 1) return false;
    }

    return true;
  }
  
}

module.exports = Blockchain;
