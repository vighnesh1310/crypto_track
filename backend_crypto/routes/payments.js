const express = require('express');
const router = express.Router();

// Mock POST /api/payments/create-charge
router.post('/create-charge', (req, res) => {
  const { name, description, amount, currency } = req.body;

  console.log("💡 Mock Payment Request:", { name, description, amount, currency });

  // Simulated response structure from Coinbase
  res.json({
    data: {
      id: "mock_charge_12345",
      hosted_url: "http://localhost:3000/payment-success",
      pricing: {
        local: {
          amount,
          currency
        }
      },
      status: "pending"
    }
  });
});

module.exports = router;
