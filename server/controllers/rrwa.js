const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');

// RRWA ABI placeholder, replace with your verified ABI
const RRWA_ABI = [
  // ... your RRWA ABI here ...
];

const rpcUrl = process.env.XDC_RPC_URL;
const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

// Server signer
const signer = new ethers.Wallet(process.env.MINTER_PRIVATE_KEY, provider);

const rrwa = new ethers.Contract(process.env.RRWA_ADDRESS, RRWA_ABI, signer);

// -------------------
// Mint endpoint
// POST /api/rrwa/mint
// -------------------
router.post('/mint', async (req, res) => {
  try {
    const { to, amount, requestId } = req.body;
    if (!ethers.utils.isAddress(to)) return res.status(400).json({ error: 'Invalid address' });
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

    const decimals = await rrwa.decimals();
    const amountWei = ethers.utils.parseUnits(amount.toString(), decimals);

    const tx = await rrwa.mint(to, amountWei, { gasLimit: 400000 });
    const receipt = await tx.wait();

    return res.json({ success: true, txHash: receipt.transactionHash });
  } catch (err) {
    console.error('Mint error', err);
    return res.status(500).json({ error: err.message || 'Mint failed' });
  }
});

// -------------------
// Transfer endpoint
// POST /api/rrwa/transfer
// -------------------
router.post('/transfer', async (req, res) => {
  try {
    const { to, amount } = req.body;
    const decimals = await rrwa.decimals();
    const amountWei = ethers.utils.parseUnits(amount.toString(), decimals);
    const tx = await rrwa.transfer(to, amountWei, { gasLimit: 200000 });
    const receipt = await tx.wait();
    return res.json({ success: true, txHash: receipt.transactionHash });
  } catch (err) {
    console.error('Transfer error', err);
    return res.status(500).json({ error: err.message || 'Transfer failed' });
  }
});

// -------------------
// Status endpoint (example: get balance)
// GET /api/rrwa/status/:address
// -------------------
router.get('/status/:address', async (req, res) => {
  try {
    const address = req.params.address;
    if (!ethers.utils.isAddress(address)) return res.status(400).json({ error: 'Invalid address' });
    const decimals = await rrwa.decimals();
    const balance = await rrwa.balanceOf(address);
    return res.json({ address, balance: ethers.utils.formatUnits(balance, decimals) });
  } catch (err) {
    console.error('Status error', err);
    return res.status(500).json({ error: err.message || 'Failed to fetch balance' });
  }
});

module.exports = router;
