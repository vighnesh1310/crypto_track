import React from 'react';

export function NewsCard({ title, desc }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h5 className="font-semibold text-sm mb-2">{title}</h5>
      <p className="text-xs text-gray-500">{desc}</p>
    </div>
  );
}