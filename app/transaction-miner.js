const Transaction = require('../ledger/transaction');

class TransactionMiner {
  constructor({ blockchain, transactionPool, pubsub }) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.pubsub = pubsub;
  }

  mineTransactions() {
    const validTransactions = this.transactionPool.validTransactions();

    this.blockchain.addBlock({ data: validTransactions });

    this.pubsub.broadcastChain();

    this.transactionPool.clear();
  }
}

module.exports = TransactionMiner;
