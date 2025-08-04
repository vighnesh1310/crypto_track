// utils/formatCurrency.js

const currencySymbols = {
  usd: '$',
  inr: '₹',
  eur: '€',
  gbp: '£',
  jpy: '¥',
};

export function formatCurrency(amount, currency = 'usd') {
  const symbol = currencySymbols[currency.toLowerCase()] || currency.toUpperCase();
  return `${symbol} ${Number(amount).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}`;
}
