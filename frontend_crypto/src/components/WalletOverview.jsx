// import React, { useEffect, useState } from 'react';
// import axiosInstance from '../utils/axiosInstance';
// import { DollarSign } from 'lucide-react';
// import { useCurrency } from '../context/CurrencyContext'; // ✅ added
// import { formatCurrency } from '../utils/formatCurrency';

// export const WalletOverview = () => {
//   const [wallet, setWallet] = useState([]);
//   const [totalValue, setTotalValue] = useState(0);
//   const { currency } = useCurrency(); // ✅ added

//   useEffect(() => {
//     const fetchWallet = async () => {
//       try {
//         const res = await axiosInstance.get('/portfolio');
//         const walletArray = Array.isArray(res.data)
//           ? res.data
//           : res.data.holdings || [];

//         setWallet(walletArray);

//         const total = walletArray.reduce((sum, coin) => {
//           return sum + (coin.current_price || 0) * (coin.quantity || 0);
//         }, 0);

//         setTotalValue(total);
//       } catch (err) {
//         console.error('Error fetching wallet:', err);
//       }
//     };

//     fetchWallet();
//   }, []);

//   return (
//     <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-full">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
//           <DollarSign className="text-green-500" /> Wallet Overview
//         </h2>
//         <span className="text-green-600 dark:text-green-400 text-lg font-semibold">
//           {formatCurrency(totalValue, currency)}
//         </span>
//       </div>

//       {Array.isArray(wallet) && wallet.length > 0 ? (
//         <ul className="space-y-4">
//           {wallet.map((coin) => (
//             <li
//               key={coin._id || coin.id}
//               className="flex items-center justify-between bg-gray-100 dark:bg-gray-900 px-4 py-3 rounded-lg shadow-sm transition hover:scale-[1.01]"
//             >
//               <div className="flex items-center gap-3">
//                 {coin.image && (
//                   <img
//                     src={coin.image}
//                     alt={coin.name}
//                     className="w-8 h-8 rounded-full"
//                   />
//                 )}
//                 <div>
//                   <p className="font-medium text-gray-800 dark:text-white">
//                     {coin.name}
//                   </p>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">
//                     Qty: {coin.quantity}
//                   </p>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <p className="text-md font-semibold text-gray-800 dark:text-gray-100">
//                  {formatCurrency(coin.current_price * coin.quantity, currency)}
//                 </p>
//                 <p className="text-xs text-gray-500 dark:text-gray-400">
//                  Price: {formatCurrency(coin.current_price, currency)}
//                 </p>
//               </div>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p className="text-gray-500 dark:text-gray-400">No coins found in wallet.</p>
//       )}
//     </div>
//   );
// };

import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { DollarSign } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { formatCurrency } from '../utils/formatCurrency';

export const WalletOverview = () => {
  const [wallet, setWallet] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const { currency } = useCurrency();

  useEffect(() => {
  const fetchWallet = async () => {
    try {
      const res = await axiosInstance.get('/portfolio', {
        params: { currency: currency.toLowerCase() },
      });

      const walletArray = Array.isArray(res.data)
        ? res.data
        : res.data.holdings || [];

      const cleanedWallet = walletArray
        .map((coin) => ({
          ...coin,
          current_price: parseFloat(coin.current_price) || 0,
          quantity: parseFloat(coin.quantity) || 0,
        }))
        

      setWallet(cleanedWallet);

      const total = cleanedWallet.reduce((sum, coin) => {
        return sum + coin.current_price * coin.quantity;
      }, 0);

      setTotalValue(total);
    } catch (err) {
      console.error('❌ Error fetching wallet:', err);
    }
  };

  fetchWallet();
}, [currency]);


  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <DollarSign className="text-green-500" /> Wallet Overview
        </h2>
        <span className="text-green-600 dark:text-green-400 text-lg font-semibold">
          {formatCurrency(totalValue || 0, currency)}
        </span>
      </div>

      {wallet.length > 0 ? (
        <ul className="space-y-4">
          {wallet.map((coin) => (
            <li
              key={coin._id || coin.id}
              className="flex items-center justify-between bg-gray-100 dark:bg-gray-900 px-4 py-3 rounded-lg shadow-sm transition hover:scale-[1.01]"
            >
              <div className="flex items-center gap-3">
                {coin.image && (
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {coin.name || coin.symbol?.toUpperCase() || 'Coin'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Qty: {coin.quantity}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-md font-semibold text-gray-800 dark:text-gray-100">
                  {formatCurrency(
                    isNaN(coin.current_price * coin.quantity)
                      ? 0
                      : coin.current_price * coin.quantity,
                    currency
                  )}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Price:{' '}
                  {formatCurrency(
                    isNaN(coin.current_price) ? 0 : coin.current_price,
                    currency
                  )}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">
          No coins found in wallet.
        </p>
      )}
    </div>
  );
};
