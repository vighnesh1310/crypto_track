import axios from 'axios';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export const fetchMarketData = async (vs_currency = 'usd', per_page = 10, sparkline = false) => {
  const response = await axios.get(`${BASE_URL}/coins/markets`, {
    params: {
      vs_currency,
      order: 'market_cap_desc',
      per_page,
      page: 1,
      sparkline,
      price_change_percentage: '24h',
    }
  });
  return response.data;
};


export const fetchTrendingCoins = async () => {
  const response = await axios.get(`${BASE_URL}/search/trending`);
  return response.data.coins;
};

// Fetch historical price data for 7 days
export const fetchCoinHistory = async (coinId = 'bitcoin', days = 7, currency = 'usd') => {
  const res = await axios.get(`${BASE_URL}/coins/${coinId}/market_chart`, {
    params: {
      vs_currency: currency,
      days,
    }
  });
  return res.data.prices; // [ [timestamp, price], ... ]
};

export const fetchCoinDetails = async (coinId) => {
  const res = await axios.get(`${BASE_URL}/coins/${coinId}`, {
    params: {
      localization: false,
      tickers: false,
      market_data: true,
      community_data: false,
      developer_data: false,
      sparkline: false,
    }
  });
  return res.data;
};
