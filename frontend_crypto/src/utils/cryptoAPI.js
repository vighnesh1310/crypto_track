import axios from 'axios';

const API_KEY = process.env.REACT_APP_CRYPTOCOMPARE_API_KEY;

// 🔁 Cache the coin list to avoid repeated API calls
let coinListCache = null;

const fetchCoinList = async () => {
  if (coinListCache) return coinListCache;

  const res = await axios.get('https://min-api.cryptocompare.com/data/all/coinlist');
  coinListCache = res.data.Data; // Stores all coins by symbol
  return coinListCache;
};

// ✅ Fetch market data from your backend and enrich with full names
export const fetchMarketData = async (vs_currency = 'USD') => {
  const marketRes = await axios.get(`https://crypto-track-dbno.onrender.com/api/market?vs_currency=${vs_currency}`);
  const rawData = marketRes.data;

  const coinList = await fetchCoinList();

  const formatted = await Promise.all(
    Object.entries(rawData).map(async ([symbol, fiatData]) => {
      const fiat = fiatData[vs_currency.toUpperCase()] || {};
      const fullName = coinList?.[symbol]?.CoinName || symbol;

      const sparklineHistory = await fetchCoinHistory(symbol, 7, vs_currency);
      const sparklinePrices = sparklineHistory.map(([timestamp, price]) => price);

      return {
        id: symbol.toLowerCase(),
        symbol,
        name: fullName,
        current_price: fiat.PRICE,
        price_change_percentage_24h: fiat.CHANGEPCT24HOUR,
        market_cap: fiat.MKTCAP,
        volume_24h: fiat.VOLUME24HOUR,
        image: `https://cryptocompare.com${fiat.IMAGEURL || ''}`,
        sparkline_in_7d: {
          price: sparklinePrices,
        },
      };
    })
  );

  return formatted;
};



// 📈 Fetch historical prices using CryptoCompare
export const fetchCoinHistory = async (symbol = 'BTC', days = 7, currency = 'USD') => {
  try {
    const response = await axios.get('https://min-api.cryptocompare.com/data/v2/histoday', {
      params: {
        fsym: symbol,
        tsym: currency,
        limit: days,
      },
      headers: {
        authorization: `Apikey ${API_KEY}`,
      },
    });

    const history = response.data?.Data?.Data;
    if (!Array.isArray(history)) {
      console.warn(`⚠️ No history found for ${symbol}`);
      return []; // Return empty array on failure
    }

    return history.map(d => [d.time * 1000, d.close]);
  } catch (err) {
    console.error(`❌ Error fetching history for ${symbol}:`, err.message);
    return []; // Prevent crash
  }
};


// 🧾 Fetch coin details from CryptoCompare
export const fetchCoinDetails = async (symbol = 'BTC', currency = 'USD') => {
  const response = await axios.get('https://min-api.cryptocompare.com/data/pricemultifull', {
    params: {
      fsyms: symbol,
      tsyms: currency
    },
    headers: {
      authorization: `Apikey ${API_KEY}`
    }
  });

  const data = response.data.RAW[symbol]?.[currency];

  return {
    id: symbol,
    name: symbol,
    symbol: symbol,
    image: `https://www.cryptocompare.com${data.IMAGEURL || ''}`,
    market_data: {
      current_price: { [currency.toLowerCase()]: data.PRICE },
      market_cap: { [currency.toLowerCase()]: data.MKTCAP },
      total_volume: { [currency.toLowerCase()]: data.VOLUME24HOURTO },
      circulating_supply: data.SUPPLY,
      price_change_percentage_24h: data.CHANGEPCT24HOUR
    },
    description: { en: '' }
  };
};

// 🗞️ Fetch live crypto news from CryptoCompare
export const fetchCryptoNews = async (category = 'BTC,ETH,NFT,Blockchain', lang = 'EN', limit = 5) => {
  try {
    const response = await axios.get('https://min-api.cryptocompare.com/data/v2/news/', {
      params: {
        lang,
        categories: category,
        l: limit,
      },
      headers: {
        authorization: `Apikey ${API_KEY}`,
      },
    });

    return response.data.Data;
  } catch (err) {
    console.error('❌ Error fetching crypto news:', err.message);
    return [];
  }
};
