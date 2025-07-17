// components/NewsSection.jsx
import React from 'react';
import { Newspaper } from 'lucide-react';

const dummyNews = [
  {
    title: 'Bitcoin ETFs Gain Momentum in US Market',
    source: 'CoinDesk',
    link: '#'
  },
  {
    title: 'Ethereum’s Next Upgrade Slated for Q4',
    source: 'CoinTelegraph',
    link: '#'
  },
  {
    title: 'India Considers Crypto Regulatory Sandbox',
    source: 'Economic Times',
    link: '#'
  }
];

export function NewsSection() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Newspaper className="w-5 h-5 text-blue-500" /> Crypto News
      </h3>
      <ul className="space-y-4 text-sm">
        {dummyNews.map((item, i) => (
          <li key={i}>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {item.title}
            </a>
            <p className="text-xs text-gray-500 dark:text-gray-400">{item.source}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
