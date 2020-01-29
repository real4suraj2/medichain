const MINE_RATE = 1000;
const INITIAL_DIFFICULTY = 3;

const INITIAL_REPORT = [{
	id : 'null',
	departments : [],
	medications : [],
	prescriptions : [],
	descriptions : {}
	}];


const GENESIS_DATA = {
  timestamp: 1,
  lastHash: '-----',
  hash: 'hash-one',
  difficulty: INITIAL_DIFFICULTY,
  nonce: 0,
  data: INITIAL_REPORT
};

const ADMIN_KEY = 'B464AAC2C42235092FBE878C644C6358C06D42B12DEDDBB9F1F2D6E67A647747';

module.exports = {
  GENESIS_DATA,
  MINE_RATE,
  ADMIN_KEY
};
