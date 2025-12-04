const { ethers } = require('ethers');
const config = require('../src/config'); // make sure you have config loader

// Load ABIs
const raaskoinAbi = require('../abi/Raaskoin.json');
const raastokenAbi = require('../abi/Raastoken.json');

// Addresses
const raaskoinAddress = 'xdc7e88Fb6dC8E1Df1099e92a806cEfC58f5F466993';
const raastokenAddress = 'xdc55CDF6069393F76E42323C046baEF62a818EF6d1';

// Provider
const provider = new ethers.JsonRpcProvider(config.xdcRpcUrl);

// Signer
const privateKey = process.env.MINTER_PRIVATE_KEY; // store in .env
const wallet = new ethers.Wallet(privateKey, provider);

// Contracts
const raaskoinContract = new ethers.Contract(raaskoinAddress, raaskoinAbi, wallet);
const raastokenContract = new ethers.Contract(raastokenAddress, raastokenAbi, wallet);

/**
 * Distribute tokens to an investor
 * e.g., mint Raaskoin and transfer Raastoken
 */
async function distributeTokens(recipient, amount) {
  try {
    console.log(`⚙️  Distributing tokens to ${recipient}...`);

    // Example: mint Raaskoin
    const tx1 = await raaskoinContract.mint(recipient, amount);
    await tx1.wait();
    console.log(`✅ Raaskoin minted: ${tx1.hash}`);

    // Example: transfer Raastoken
    const tx2 = await raastokenContract.transfer(recipient, amount);
    await tx2.wait();
    console.log(`✅ Raastoken transferred: ${tx2.hash}`);

    return { success: true, txRaaskoin: tx1.hash, txRaastoken: tx2.hash };
  } catch (error) {
    console.error('❌ Token distribution failed:', error);
    throw error;
  }
}

module.exports = { distributeTokens };
