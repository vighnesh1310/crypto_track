import axios from 'axios';

export const getUserProfile = async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get('/api/profile', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // { name, email, avatarUrl }
};
