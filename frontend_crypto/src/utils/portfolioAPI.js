import axiosInstance from './axiosInstance';

export const fetchUserHoldings = async () => {
  const res = await axiosInstance.get('/portfolio');
  return res.data.holdings;
};

export const updateHolding = async (coinId, amount) => {
  return axiosInstance.post('/portfolio', { coinId, amount });
};

export const deleteHolding = async (coinId) => {
  return axiosInstance.delete(`/portfolio/${coinId}`);
};
