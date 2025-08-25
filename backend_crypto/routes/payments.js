const express = require("express");
const axios = require("axios");
const router = express.Router();

const BTCPAY_URL = process.env.BTCPAY_URL;        // e.g. https://btcpay.yourdomain.com
const BTCPAY_API_KEY = process.env.BTCPAY_API_KEY; // Testnet API key
const BTCPAY_STORE_ID = process.env.BTCPAY_STORE_ID; // Your testnet store ID

// POST /api/payments/create-invoice
router.post("/create-invoice", async (req, res) => {
  try {
    const { name, description, amount, currency } = req.body;

    const response = await axios.post(
      `${BTCPAY_URL}/api/v1/stores/${BTCPAY_STORE_ID}/invoices`,
      {
        amount,
        currency, // e.g. "USD"
        metadata: {
          orderId: Date.now().toString(),
          itemDesc: description,
          product: name,
        },
        checkout: {
          redirectURL: "http://localhost:3000/payment-success",
          redirectAutomatically: true,
        },
      },
      {
        headers: {
          Authorization: `token ${BTCPAY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("BTCPay error:", err.response?.data || err.message);
    res.status(500).json({ error: "Invoice creation failed" });
  }
});

module.exports = router;
