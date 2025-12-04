const express = require('express');
const router = express.Router();
const tokenService = require('../services/tokenService');

/**
 * Stripe (or crypto payment) webhook endpoint
 * Trigger token distribution when payment is successful
 */
router.post('/webhook', async (req, res) => {
  try {
    const event = req.body;

    if (event.type === 'charge.succeeded') {
      const wallet = event.data.object.metadata.investorWallet;
      const tier = event.data.object.metadata.investmentTier;
      const amount = getAmountForTier(tier); // Map tier to token amount

      const tx = await tokenService.distributeTokens(wallet, amount);

      console.log(`✅ Tokens distributed: ${JSON.stringify(tx)}`);
      return res.status(200).json({ status: 'success', tx });
    } else {
      return res.status(200).send('Unhandled event type');
    }
  } catch (err) {
    console.error('❌ Webhook error:', err);
    return res.status(500).send('Webhook failed');
  }
});

/**
 * Map investment tier to amount of tokens
 */
function getAmountForTier(tier) {
  switch (tier) {
    case 'Supporter': return 1000;
    case 'Builder': return 5000;
    case 'Partner': return 50000;
    case 'Founding Investor': return 500000;
    default: return 0;
  }
}

module.exports = router;
