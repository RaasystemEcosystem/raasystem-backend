// src/services/oracleService.js
const { ethers } = require('ethers');
require('dotenv').config(); // make sure .env is loaded

const rpcUrl = process.env.XDC_RPC_URL;
const oracleContractAddress = process.env.GOLD_ORACLE_CONTRACT_ADDRESS;

if (!rpcUrl) throw new Error("❌ XDC_RPC_URL is not set in environment variables");
if (!oracleContractAddress) throw new Error("❌ GOLD_ORACLE_CONTRACT_ADDRESS is not set in environment variables");

const oracleAbi = [
  "function latestAnswer() public view returns (int256)"
];

async function getGoldPrice() {
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const contract = new ethers.Contract(oracleContractAddress, oracleAbi, provider);

    const price = await contract.latestAnswer();
    return price.toString(); // return as string for frontend JSON
  } catch (error) {
    console.error('❌ Error in getGoldPrice:', error);
    throw error; // propagate error so the route can respond with 500
  }
}

module.exports = { getGoldPrice };
