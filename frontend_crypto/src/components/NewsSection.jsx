// components/NewsSection.jsx
import React, { useEffect, useState } from 'react';
import { fetchCryptoNews } from '../utils/cryptoAPI'; // Update path if needed
import { Newspaper } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const categories = [
  { label: 'All', value: 'BTC,ETH,NFT,Blockchain' },
  { label: 'Bitcoin', value: 'BTC' },
  { label: 'Ethereum', value: 'ETH' },
  { label: 'NFTs', value: 'NFT' },
  { label: 'DeFi', value: 'Defi' },
];

export function NewsSection() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('BTC,ETH,NFT,Blockchain');

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      const data = await fetchCryptoNews(category);
      setNews(data);
      setLoading(false);
    };

    loadNews();
  }, [category]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2" aria-label="Crypto news section">
          <Newspaper className="w-5 h-5 text-blue-500" /> Crypto News
        </h3>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="text-sm p-1 rounded border dark:bg-gray-700 dark:text-white"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading news...</p>
      ) : (
        <ul className="space-y-4 text-sm">
          {news.slice(0, 5).map((item, i) => (
            <li key={i} data-aos="fade-up">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
                aria-label={`Read article: ${item.title}`}
              >
                {item.title}
              </a>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {item.source_info.name} • {new Date(item.published_on * 1000).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
