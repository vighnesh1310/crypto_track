const express = require('express');
const router = express.Router();
const axios = require('axios');

// Load API key from environment or fallback
const API_KEY = process.env.CRYPTOCOMPARE_API_KEY || 'your_api_key_here';

router.get('/', async (req, res) => {
  try {
    const vs_currency = req.query.vs_currency?.toUpperCase() || 'USD';

    // 🔹 Fetch top coins by market cap
    const topCoinsRes = await axios.get(
      'https://min-api.cryptocompare.com/data/top/mktcapfull',
      {
        params: { limit: 50, tsym: vs_currency },
        headers: { authorization: `Apikey ${API_KEY}` }
      }
    );

    const rawData = topCoinsRes.data?.Data;

    // ❗ Check if response data is valid
    if (!Array.isArray(rawData)) {
      console.error('❌ Unexpected response from CryptoCompare:', topCoinsRes.data);
      return res.status(500).json({
        error: 'Unexpected response from CryptoCompare API',
        details: topCoinsRes.data
      });
    }

    // 🔹 Extract coin symbols
    const symbols = rawData.map((coin) => coin.CoinInfo?.Name).filter(Boolean).join(',');

    // 🔹 Fetch price data for those symbols
    const priceRes = await axios.get(
      'https://min-api.cryptocompare.com/data/pricemultifull',
      {
        params: { fsyms: symbols, tsyms: vs_currency },
        headers: { authorization: `Apikey ${API_KEY}` }
      }
    );

    res.json(priceRes.data?.RAW || {});
  } catch (error) {
    console.error('🔴 Failed to fetch top coins:', error.message);
    res.status(500).json({
      error: 'Failed to fetch top coins market data',
      details: error.response?.data || error.message
    });
  }
});

module.exports = router;
