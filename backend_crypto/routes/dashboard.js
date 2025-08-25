const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');
const Alert = require('../models/Alert');
const Watchlist = require('../models/Watchlist');
const axios = require('axios');

router.get('/summary', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    // ✅ lowercase for API
    const vs_currency = req.query.currency?.toLowerCase() || 'usd';

    const [portfolio, alerts, watchlist, sellTransactions] = await Promise.all([
      Portfolio.findOne({ user: userId }),
      Alert.find({ user: userId, triggered: true }),
      Watchlist.findOne({ user: userId }),
      Transaction.find({ user: userId, type: 'sell' })
    ]);

    const realizedProfit = sellTransactions.reduce((sum, t) => sum + (t.realizedProfit || 0), 0);

    if (!portfolio || !portfolio.holdings || portfolio.holdings.length === 0) {
      return res.json({
        totalValue: 0,
        totalInvestment: 0,
        unrealizedProfit: 0,
        realizedProfit,
        totalProfit: realizedProfit,
        totalProfitPercent: 0,
        alerts: alerts.length,
        watchlist: watchlist?.coins?.length || 0,
      });
    }

    const buyHoldings = portfolio.holdings.filter(h => h.type === 'buy');
    const symbolsArr = [...new Set(buyHoldings.map(h => h.symbol?.toUpperCase()).filter(Boolean))];

    let priceData = {};
    if (symbolsArr.length > 0) {
      try {
        const priceRes = await axios.get(`https://min-api.cryptocompare.com/data/pricemultifull`, {
          params: { fsyms: symbolsArr.join(','), tsyms: vs_currency.toUpperCase() }
        });
        priceData = priceRes.data?.RAW || {};
      } catch (err) {
        console.error("Price API Error:", err.message);
        priceData = {}; // fallback so app doesn't crash
      }
    }

    let totalValue = 0;
    let totalInvestment = 0;

    for (const h of buyHoldings) {
      const symbol = h.symbol?.toUpperCase();
      const quantity = h.quantity || 0;
      const avgPrice = h.averageBuyPrice || 0;

      // ✅ safe lookup for missing price
      const price = priceData[symbol]?.[vs_currency.toUpperCase()]?.PRICE || 0;

      totalValue += quantity * price;
      totalInvestment += quantity * avgPrice;
    }

    const unrealizedProfit = totalValue - totalInvestment;
    const totalProfit = unrealizedProfit + realizedProfit;

    // ✅ formula untouched
    const totalProfitPercent = totalInvestment > 0
      ? (totalProfit / totalInvestment) * 100
      : 0;

    res.json({
      totalValue,
      totalInvestment,
      unrealizedProfit,
      realizedProfit,
      totalProfit,
      totalProfitPercent,
      alerts: alerts.length,
      watchlist: watchlist?.coins?.length || 0
    });

  } catch (err) {
    console.error('Dashboard Summary Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch dashboard summary' });
  }
});

module.exports = router;
