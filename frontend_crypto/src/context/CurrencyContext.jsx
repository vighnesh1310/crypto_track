import { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const { user } = useUser();
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    if (user?.settings?.defaultCurrency) {
      setCurrency(user.settings.defaultCurrency);
    }
  }, [user?.settings?.defaultCurrency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
