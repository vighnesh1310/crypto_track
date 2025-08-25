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
    const vs_currency = req.query.currency?.toLowerCase() || 'usd';

    const [portfolio, alerts, watchlist, sellTransactions] = await Promise.all([
      Portfolio.findOne({ user: userId }),
      Alert.find({ user: userId, triggered: true }),
      Watchlist.findOne({ user: userId }),
      Transaction.find({ user: userId, type: 'sell' })
    ]);

    // 🔹 Conversion rate for all USD-stored values
    let conversionRate = 1;
    if (vs_currency !== 'usd') {
      try {
        const rateRes = await axios.get(
          `https://min-api.cryptocompare.com/data/price`,
          { params: { fsym: 'USD', tsyms: vs_currency.toUpperCase() } }
        );
        conversionRate = rateRes.data?.[vs_currency.toUpperCase()] || 1;
      } catch (err) {
        console.error("Conversion Rate Error:", err.message);
      }
    }

    // 🔹 Convert realized profit to requested currency
    const realizedProfit = sellTransactions.reduce(
      (sum, t) => sum + (t.realizedProfit || 0),
      0
    ) * conversionRate;

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
        priceData = {};
      }
    }

    let totalValue = 0;
    let totalInvestment = 0;

    for (const h of buyHoldings) {
      const symbol = h.symbol?.toUpperCase();
      const quantity = h.quantity || 0;

      // 🔹 Convert avg buy price (stored in USD) to requested currency
      const avgPrice = (h.averageBuyPrice || 0) * conversionRate;

      const price = priceData[symbol]?.[vs_currency.toUpperCase()]?.PRICE || 0;

      totalValue += quantity * price;
      totalInvestment += quantity * avgPrice;
    }

    const unrealizedProfit = totalValue - totalInvestment;
    const totalProfit = unrealizedProfit + realizedProfit;

    const totalProfitPercent =
      totalInvestment > 0 ? (totalProfit / totalInvestment) * 100 : 0;

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
