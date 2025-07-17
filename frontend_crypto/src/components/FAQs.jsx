import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export function FAQs() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const [openIndex, setOpenIndex] = useState(null);
  const faqs = [
    {
      question: 'Is CryptoTrack free to use?',
      answer: 'Yes! You can track coins, manage your portfolio, and set alerts for free.',
    },
    {
      question: 'Can I sync my portfolio across devices?',
      answer: 'Yes, with a secure login your portfolio stays synced on any device.',
    },
    {
      question: 'Do I get real-time price updates?',
      answer: 'Absolutely! Prices are fetched live from CoinGecko every few seconds.',
    },
  ];

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section
      className="mt-20 bg-white/30 dark:bg-white/10 backdrop-blur-lg p-10 rounded-xl shadow-xl"
      id="faqs"
    >
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
        Frequently Asked Questions
      </h2>
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="bg-white/60 dark:bg-gray-800/80 text-gray-800 dark:text-white border border-white/20 rounded-lg p-5 shadow hover:shadow-xl transition duration-300 cursor-pointer"
            onClick={() => toggle(i)}
            data-aos="fade-up"
            data-aos-delay={i * 100}
          >
            <div className="flex justify-between items-center font-semibold">
              <span>{faq.question}</span>
              <span className="text-xl font-bold">
                {openIndex === i ? '−' : '+'}
              </span>
            </div>
            {openIndex === i && (
              <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
