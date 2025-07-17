// components/CoinDescription.jsx
import React from 'react';

export function CoinDescription({ description, homepage }) {
  const cleanHTML = description?.replace(/<[^>]+>/g, ''); // Strip HTML tags

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
      <h3 className="text-lg font-semibold mb-3">📝 About</h3>
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
        {cleanHTML ? cleanHTML.slice(0, 600) + '...' : 'No description available.'}
      </p>
      {homepage && (
        <a
          href={homepage}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
        >
          Visit Official Site ↗
        </a>
      )}
    </div>
  );
}
