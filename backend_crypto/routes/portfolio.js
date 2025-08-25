const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');
const axios = require('axios');

// ========================
// 📊 GET PORTFOLIO
// ========================
router.get('/', auth, async (req, res) => {
  try {
    const { type } = req.query;
    const vs_currency = req.query.currency?.toUpperCase() || 'USD';

    const portfolio = await Portfolio.findOne({ user: req.user.id });
    let holdings = portfolio?.holdings || [];

    if (type) {
      holdings = holdings.filter((h) => h.type === type);
    }

    if (holdings.length === 0) return res.json([]);

    const symbols = holdings.map(h => h.symbol.toUpperCase()).join(',');
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbols}&tsyms=${vs_currency}`;
    const priceRes = await axios.get(url);
    const priceData = priceRes.data.RAW;

    const enrichedHoldings = holdings.map(h => {
      const symbol = h.symbol.toUpperCase();
      const priceInfo = priceData?.[symbol]?.[vs_currency];

      return {
        ...h._doc,
        current_price: priceInfo?.PRICE || h.current_price || 0,
        image: priceInfo?.IMAGEURL
          ? `https://www.cryptocompare.com${priceInfo.IMAGEURL}`
          : h.image || '',
        name: h.name || symbol,
        value: (priceInfo?.PRICE || 0) * h.quantity,
      };
    });

    res.json(enrichedHoldings);
  } catch (err) {
    console.error('❌ Error fetching portfolio:', err.message);
    res.status(500).json({ error: 'Server error while fetching portfolio.' });
  }
});

// ========================
// ➕ ADD TO PORTFOLIO (Track or Buy)
// ========================
router.post('/', auth, async (req, res) => {
  const { coinId, symbol, amount, type = 'track', image, name, current_price } = req.body;

  if (!coinId || !symbol || !amount) {
    return res.status(400).json({ error: 'coinId, symbol, and amount are required.' });
  }

  try {
    let portfolio = await Portfolio.findOne({ user: req.user.id });
    if (!portfolio) {
      portfolio = new Portfolio({ user: req.user.id, holdings: [] });
    }

    const existing = portfolio.holdings.find(
      (h) => h.coinId === coinId && h.type === type
    );

    if (existing) {
      if (type === 'buy') {
        existing.quantity += amount;
      } else {
        return res.status(200).json({ message: 'Coin already tracked in portfolio.' });
      }
    } else {
      portfolio.holdings.push({
        coinId,
        symbol,
        quantity: amount,
        averageBuyPrice: type === 'buy' ? current_price : 0,
        type,
        image,
        name,
        current_price,
     });

    }

    await portfolio.save();
    res.status(200).json({ message: 'Coin added to portfolio.', holdings: portfolio.holdings });
  } catch (err) {
    console.error('Error adding to portfolio:', err.message);
    res.status(500).json({ error: 'Failed to add coin.' });
  }
});

// ========================
// 💰 BUY / SELL
// ========================
router.post('/update', auth, async (req, res) => {
  const { coinId, symbol, quantity, price, type } = req.body;
  const userId = req.user.id;

  if (!['buy', 'sell'].includes(type)) {
    return res.status(400).json({ error: 'Invalid transaction type.' });
  }

  if (!coinId || !symbol || !quantity || !price) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    let portfolio = await Portfolio.findOne({ user: userId });

    if (!portfolio) {
      portfolio = new Portfolio({ user: userId, holdings: [] });
    }

    const index = portfolio.holdings.findIndex(h => h.coinId === coinId);

    if (type === 'buy') {
  if (index >= 0) {
    const existing = portfolio.holdings[index];
    const totalCost = (existing.averageBuyPrice || 0) * existing.quantity + price * quantity;
    const newQuantity = existing.quantity + quantity;

    portfolio.holdings[index].quantity = newQuantity;
    portfolio.holdings[index].averageBuyPrice = totalCost / newQuantity;
    portfolio.holdings[index].type = 'buy';
  } else {
    portfolio.holdings.push({
      coinId,
      symbol,
      quantity,
      averageBuyPrice: price,
      type: 'buy',
    });
  }

  // ✅ Log the BUY transaction
  await Transaction.create({
    user: userId,
    coinId,
    symbol,
    type: 'buy',
    quantity,
    price,
  });

} else if (type === 'sell') {
  if (index === -1 || portfolio.holdings[index].quantity < quantity) {
    return res.status(400).json({ error: 'Insufficient quantity to sell.' });
  }

  const avgPrice = portfolio.holdings[index].averageBuyPrice || 0;
  const currentQty = portfolio.holdings[index].quantity;

  // Deduct quantity
  portfolio.holdings[index].quantity -= quantity;

  // Calculate realized profit
  const realizedProfit = (price - avgPrice) * quantity;

  // Remove if zero
  if (portfolio.holdings[index].quantity === 0) {
    portfolio.holdings.splice(index, 1);
  }

  // ✅ Log the SELL transaction
  await Transaction.create({
    user: userId,
    coinId,
    symbol,
    type: 'sell',
    quantity,
    price,
    realizedProfit,
  });
}

    await portfolio.save();

    res.json({ message: `${type.toUpperCase()} successful`, holdings: portfolio.holdings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during transaction' });
  }
});

// ========================
// 📄 GET TRANSACTIONS
// ========================
router.get('/transactions', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// ========================
// 📈 PORTFOLIO VALUE HISTORY
// ========================
router.get('/portfolio-history', auth, async (req, res) => {
  const { range = '7D', currency = 'USD' } = req.query;
  const vs_currency = currency.toUpperCase();

  const rangeMap = {
    '1D': { limit: 24, aggregate: 1, endpoint: 'histohour' },
    '7D': { limit: 7, aggregate: 1, endpoint: 'histoday' },
    '14D': { limit: 14, aggregate: 1, endpoint: 'histoday' },
    '30D': { limit: 30, aggregate: 1, endpoint: 'histoday' },
    '90D': { limit: 90, aggregate: 3, endpoint: 'histoday' },
    '1Y': { limit: 365, aggregate: 7, endpoint: 'histoday' },
  };

  const { limit, aggregate, endpoint } = rangeMap[range.toUpperCase()] || rangeMap['7D'];

  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });
    if (!portfolio || portfolio.holdings.length === 0) return res.json([]);

    const historyPromises = portfolio.holdings.map(async (holding) => {
      const symbol = holding.symbol.toUpperCase();
      const url = `https://min-api.cryptocompare.com/data/v2/${endpoint}?fsym=${symbol}&tsym=${vs_currency}&limit=${limit}&aggregate=${aggregate}`;

      try {
        const response = await axios.get(url);
        const prices = Array.isArray(response.data?.Data?.Data) ? response.data.Data.Data : [];

        return {
          symbol,
          quantity: holding.quantity,
          prices,
        };
      } catch (err) {
        console.error(`❌ Error fetching history for ${symbol}:`, err.message);
        return null;
      }
    });

    const coinHistories = (await Promise.all(historyPromises)).filter(Boolean);

    const numPoints = coinHistories[0]?.prices?.length || 0;
    const chartData = [];

    for (let i = 0; i < numPoints; i++) {
      let totalValue = 0;
      let dateLabel = '';

      for (const coin of coinHistories) {
        const point = coin.prices[i];
        if (!point) continue;

        const price = point.close || 0;
        const date = new Date(point.time * 1000);
        if (!dateLabel) {
          dateLabel = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
          });
        }

        totalValue += price * coin.quantity;
      }

      chartData.push({
        date: dateLabel,
        value: parseFloat(totalValue.toFixed(2)),
      });
    }

    res.json(chartData);
  } catch (err) {
    console.error('❌ Portfolio history fetch failed:', err.message);
    res.status(500).json({ error: 'Error generating portfolio history' });
  }
});

module.exports = router;