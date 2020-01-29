const Transaction = require('../ledger/transaction');

class TransactionMiner {
   constructor({blockchain,transactionPool, ledger, pubsub}) {
	 this.blockchain = blockchain;
	 this.transactionPool = transactionPool;
	 this.ledger = ledger;
	 this.pubsub = pubsub;   
  }

  mineTransactions() {
    const validTransactions = this.transactionPool.validTransactions();

    validTransactions.push(
      Transaction.rewardTransaction({ minerWallet: this.wallet })
    );

    this.blockchain.addBlock({ data: validTransactions });

    this.pubsub.broadcastChain();

    this.transactionPool.clear();
  }

}

module.exports = TransactionMiner;