const { ethers } = require('ethers');
const rrwaAbi = require('../controllers/rrwa').RRWA_ABI;

const provider = new ethers.providers.JsonRpcProvider(process.env.XDC_RPC_URL);
const rrwa = new ethers.Contract(process.env.RRWA_ADDRESS, rrwaAbi, provider);

async function pollEvents() {
  console.log('Starting RRWA event listener...');
  
  rrwa.on('Transfer', async (from, to, value, event) => {
    console.log(`Transfer event: ${from} -> ${to}, value: ${value.toString()}`);
    // TODO: persist to MongoDB / reconcile ledger
  });

  rrwa.on('Mint', async (to, value, event) => {
    console.log(`Mint event: to ${to}, value: ${value.toString()}`);
    // TODO: persist to MongoDB / reconcile ledger
  });
}

pollEvents().catch(console.error);
