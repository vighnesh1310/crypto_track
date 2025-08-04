// context/UserContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import API from '../utils/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.avatarUrl && !parsed.avatar) {
          parsed.avatar = parsed.avatarUrl; // normalize avatar
        }
        setUser(parsed);
      } catch (err) {
        console.error('Failed to parse stored user:', err);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Fetch from backend
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await API.get('/user/profile');
        const data = res.data;

        // ✅ normalize avatarUrl → avatar
        if (data.avatarUrl && !data.avatar) {
          data.avatar = data.avatarUrl;
        }

        setUser(data);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setUser(null);
        localStorage.removeItem('token');
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
