const Web3 = require('web3');
require('dotenv').config();

const { XDC_RPC_URL, GOLD_ORACLE_CONTRACT_ADDRESS } = process.env;

const goldOracleAbi = [
  {
    "inputs": [],
    "name": "getLatestGoldPrice",
    "outputs": [
      { "internalType": "uint256", "name": "price", "type": "uint256" },
      { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const web3 = new Web3(new Web3.providers.HttpProvider(XDC_RPC_URL));
const oracleContract = new web3.eth.Contract(goldOracleAbi, GOLD_ORACLE_CONTRACT_ADDRESS);

async function fetchGoldPrice() {
  try {
    const { price, timestamp } = await oracleContract.methods.getLatestGoldPrice().call();
    return {
      price: parseFloat(web3.utils.fromWei(price, 'ether')),
      timestamp: new Date(parseInt(timestamp) * 1000).toISOString()
    };
  } catch (err) {
    throw new Error(`Oracle fetch failed: ${err.message}`);
  }
}

module.exports = {
  fetchGoldPrice
};
