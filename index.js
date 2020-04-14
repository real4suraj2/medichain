const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const request = require('request');
const path = require('path');
const Blockchain = require('./blockchain');
var cors = require('cors')
const PubSub = require('./app/pubsub');
const TransactionPool = require('./ledger/transaction-pool');
const Ledger = require('./ledger');
const TransactionMiner = require('./app/transaction-miner');
const {
    ec
} = require('./util');
const {
    ADMIN_KEY
} = require('./config');

const User = require('./schema');
mongoose
    .connect(
        'mongodb+srv://suraj:yGn6Otz0kNPFGXML@cluster0-kjw1n.mongodb.net/test?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    )
    .then(() => {
        console.log("Connected to database!");
    })
    .catch(() => {
        console.log("Connection failed!");
    });
mongoose.set('useFindAndModify', false);

const isDevelopment = process.env.ENV === 'development';

const REDIS_URL = process.env.ENV === 'development' ? 'redis://127.0.0.1:6379' : 'redis://h:pb8403dc91690a7f750c3a6244d8a09c0374172a29850214299f7c9ab72d8bb4b@ec2-3-210-246-86.compute-1.amazonaws.com:15789';
const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

const app = express();
app.use(cors())
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const pubsub = new PubSub({
    blockchain,
    transactionPool,
    redisUrl: REDIS_URL
});
const transactionMiner = new TransactionMiner({
    blockchain,
    transactionPool,
    pubsub
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client/dist')));

app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.get('/api/blocks/:id', (req, res) => {
    const {
        id
    } = req.params;
    const {
        length
    } = blockchain.chain;

    const blocksReversed = blockchain.chain.slice().reverse();

    let startIndex = (id - 1) * 5;
    let endIndex = id * 5;

    startIndex = startIndex < length ? startIndex : length;
    endIndex = endIndex < length ? endIndex : length;

    res.json(blocksReversed.slice(startIndex, endIndex));
});

app.post('/api/mine', (req, res) => {
    const {
        data
    } = req.body;
    blockchain.addBlock({
        data
    });

    pubsub.broadcastChain();

    res.redirect('/api/blocks');
});

let saveUser = (type, data, callback) => {
    if (type === 'patient') {
        const {
            name,
            dob,
            sex,
            email,
            password,
            publicKey,
            privateKey
        } = data;
        User.findById(email).then(user => {
            if (user === null) {
                const newUser = new User({
                    name,
                    password,
                    publicKey,
                    privateKey,
                    kind: 'patient',
                    _id: email
                });
                newUser.save().then(res => callback({
                    type: 'success'
                })).catch(error => callback({
                    type: 'error'
                }));
            } else {
                callback({
                    type: 'userAlready'
                });
            }
        });
    } else if (type === 'department') {
        const {
            email,
            password,
            name,
            publicKey,
            privateKey
        } = data;
        User.findById(email).then(user => {
            if (user === null) {
                const newUser = new User({
                    name,
                    password,
                    publicKey,
                    privateKey,
                    kind: 'non-validated',
                    _id: email
                });
                newUser.save().then(res => callback({
                    type: 'success'
                })).catch(error => callback({
                    type: 'error'
                }));
            } else if (user.kind === 'patient') {
                callback({
                    type: 'EmailCannotBeSame'
                });
            } else {
                callback({
                    type: 'userAlready'
                });
            }
        });
    }
}


let verifyEmailAndPassword = (email, password, callback) => {
    User.findById(email).then(user => {
        //console.log(user);
        if (user === null) {
            console.log('new user');
            return callback({
                authenticated: 'false',
                kind: 'Invalid username or password'
            });
        } else if (user._id == email && user.password == password) {
            console.log("accepted");
            return callback({
                authenticated: 'true',
                kind: user.kind,
                publicKey: user.publicKey,
                privateKey: user.privateKey
            });
        } else if (user._id == email && user.password != password) {
            console.log("mismatch");
            return callback({
                authenticated: 'false',
                kind: 'Invalid password'
            });
        } else {
            console.log("None matched");
            return callback({
                authenticated: 'false',
                kind: 'Invalid username or password'
            });
        }
    });
}



app.post('/api/login', (req, res) => {
    const {
        email,
        password
    } = req.body;
    verifyEmailAndPassword(email, password, (result) => {
        const {
            authenticated,
            kind
        } = result;
        if (authenticated === 'false') {
            return res.send({
                authenticated,
                kind
            });
        }
        const {
            publicKey,
            privateKey
        } = result;
        res.send({
            publicKey,
            privateKey,
            authenticated,
            kind
        });
    });
})

app.post('/api/signUp', (req, res) => {
    const {
        type,
        email,
        password,
        name
    } = req.body;
    const key = ec.genKeyPair();
    const publicKey = key.getPublic('hex');
    const privateKey = key.getPrivate('hex');
    if (type === 'patient') {
        const {
            dob,
            sex
        } = req.body;
        saveUser('patient', {
            email,
            password,
            publicKey,
            privateKey,
            dob,
            sex,
            name
        }, (result) => {
            if (result.type === 'error') {
                return res.status(500).send({
                    message: 'Unable to handle'
                });
            }
            if (result.type === 'success') {
                let response = transact({
                    report: {
                        dob,
                        sex,
                        id: 'bio'
                    },
                    publicKey,
                    privateKey,
                    by: 'patient',
                    receiver: publicKey
                });
                return res.status(200).send({
                    message: 'Success !!'
                });
            }
            if (result.type === 'userAlready') {
                return res.status(200).send({
                    message: 'User with the same email address already exists..'
                });
            }
        });
    } else if (type === 'department') {
        saveUser('department', {
            email,
            password,
            name,
            publicKey,
            privateKey
        }, (result) => {
            if (result.type === 'error') {
                return res.status(500).send({
                    message: 'Unable to handle'
                });
            }
            if (result.type === 'success') {
                return res.status(200).send({
                    message: publicKey
                });
            }
            if (result.type === 'userAlready') {
                return res.status(200).send({
                    message: 'A department with this email address already exists..'
                });
            }
            if (result.type === 'EmailCannotBeSame') {
                return res.status(200).send({
                    message: 'Department and patient addresses cannot be same..'
                });
            }
        });
    }
})

app.post('/api/validate', (req, res) => {
    if (req.headers['x-auth'] === ADMIN_KEY) {
        const {
            publicKey,
            departmentType,
            departmentFacilities,
            issuer,
            departmentLocation
        } = req.body;
        User.findOneAndUpdate({
            publicKey
        }, {
            $set: {
                kind: "department"
            }
        }, {
            new: true
        }, (err, doc) => {
            if (err === null && doc) {
                let response = transact({
                    publicKey,
                    privateKey: doc.privateKey,
                    receiver: publicKey,
                    report: {
                        departmentType,
                        departmentFacilities,
                        departmentLocation,
                        issuer,
                        id: 'bio'
                    },
                    by: 'department'
                });
                res.status(200).send({message : 'success'});
            }
        });
    } else {
        res.status(500);
    }
})
let transact = ({
    publicKey,
    privateKey,
    receiver,
    report,
    by
}) => {
    const ledger = new Ledger({
        publicKey,
        privateKey
    });
    let transaction = transactionPool.existingTransaction({
        inputAddress: ledger.publicKey
    });
    try {
        if (transaction) {
            transaction.update({
                senderLedger: ledger,
                receiver,
                report,
                by
            });
        } else {
            transaction = ledger.createTransaction({
                receiver,
                report,
                chain: blockchain.chain,
                by
            });
        }
    } catch (error) {
        return ({
            type: 'error',
            message: error.message
        });
    }

    transactionPool.setTransaction(transaction);

    pubsub.broadcastTransaction(transaction);

    return ({
        type: 'success',
        transaction
    });
}

app.post('/api/transact', (req, res) => {
    let {
        report,
        receiver,
        publicKey,
        privateKey,
        by
    } = req.body;
    const ledger = new Ledger({
        publicKey,
        privateKey
    });
    let transaction = transactionPool
        .existingTransaction({
            inputAddress: ledger.publicKey
        });
    try {
        if (transaction) {
            transaction.update({
                senderLedger: ledger,
                receiver,
                report,
                by
            });
        } else {
            transaction = ledger.createTransaction({
                receiver,
                report,
                chain: blockchain.chain,
                by
            });
        }
    } catch (error) {
        return res.status(400).json({
            type: 'error',
            message: error.message
        });
    }

    transactionPool.setTransaction(transaction);

    pubsub.broadcastTransaction(transaction);

    res.json({
        type: 'success',
        transaction
    });
});

app.get('/api/transaction-pool-map', (req, res) => {
    res.json(transactionPool.transactionMap);
});

app.get('/api/mine-transactions', (req, res) => {
    transactionMiner.mineTransactions();

    res.redirect('/api/blocks');
});

app.get('/api/generate-ledger', (req, res) => {
    const key = ec.genKeyPair();
    const publicKey = key.getPublic('hex');
    const privateKey = key.getPrivate('hex');
    res.send({
        publicKey,
        privateKey
    })
})

app.post('/api/ledger-info', (req, res) => {
    const address = req.body.publicKey;
    const {
        privateKey,
        kind
    } = req.body;
    if (kind === "department") {
        User.find().then(users => {
            for (let user of users) {
                if (user.publicKey === address) {
                    const name = user.name;
                    return res.json({
                        address,
                        patientReports: Ledger.getPatientReports({
                            chain: blockchain.chain,
                            address
                        }),
                        bio: Ledger.getBio({
                            chain: blockchain.chain,
                            address
                        }),
                        name
                    })
                }
            }
        });
    } else if (kind === "patient") {
        User.find().then(users => {
            for (let user of users) {
                if (user.publicKey === address) {
                    const name = user.name;
                    return res.json({
                        address,
                        reports: Ledger.getReports({
                            chain: blockchain.chain,
                            address
                        }),
                        sharedReports: Ledger.getSharedReports({
                            chain: blockchain.chain,
                            address
                        }),
                        incomingReports: Ledger.getIncomingReports({
                            chain: blockchain.chain,
                            address
                        }),
                        bio: Ledger.getBio({
                            chain: blockchain.chain,
                            address
                        }),
                        name
                    });
                }
            }
        });
    } else if (kind === "admin") {
        User.find().then(users => {
            let result = [];
            users.forEach(user => {
                if (user.kind === "department")
                    result.push(user.publicKey)
            });
            return res.json({
                validDepartments: result
            });
        });
    }

});

app.get('/api/known-addresses', (req, res) => {
    const addressMap = {};
    for (let block of blockchain.chain) {
        for (let transaction of block.data) {
            const receiver = Object.keys(transaction.outputMap);

            receiver.forEach(receiver => addressMap[receiver] = receiver);
        }
    }

    res.json(Object.keys(addressMap));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

const syncWithRootState = () => {
    request({
        url: `${ROOT_NODE_ADDRESS}/api/blocks`
    }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const rootChain = JSON.parse(body);

            console.log('replace chain on a sync with', rootChain);
            blockchain.replaceChain(rootChain);
        }
    });

    request({
        url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map`
    }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const rootTransactionPoolMap = JSON.parse(body);

            console.log('replace transaction pool map on a sync with', rootTransactionPoolMap);
            transactionPool.setMap(rootTransactionPoolMap);
        }
    });
};



let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = process.env.PORT || PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
    console.log(`listening at localhost:${PORT}`);

    if (PORT !== DEFAULT_PORT) {
        syncWithRootState();
    }
});
