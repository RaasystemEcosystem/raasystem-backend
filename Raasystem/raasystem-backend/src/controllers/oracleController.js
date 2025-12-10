// Oracle Controller
const getGoldPrice = async (req, res) => {
  try {
    // Replace with actual oracle logic
    res.json({ goldPrice: 2000 }); // Example static price
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getGoldPrice };
