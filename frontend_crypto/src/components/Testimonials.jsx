// components/Testimonials.jsx
import React from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export function Testimonials() {
  React.useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const feedback = [
    {
      name: 'Anjali S.',
      role: 'Crypto Enthusiast',
      text: 'CryptoTrack changed how I manage my investments. The alerts and real-time data are game changers!',
      image: 'https://i.pravatar.cc/100?img=1'
    },
    {
      name: 'Rahul P.',
      role: 'Developer',
      text: 'Beautiful dashboard and intuitive UI. Love the way everything syncs in real time!',
      image: 'https://i.pravatar.cc/100?img=2'
    },
    {
      name: 'Neha R.',
      role: 'Investor',
      text: 'Finally, a clean and responsive crypto tracker I can rely on. Highly recommended!',
      image: 'https://i.pravatar.cc/100?img=3'
    }
  ];

  return (
    <section
      className="mt-20 bg-white/40 dark:bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-10"
      id="testimonials"
    >
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
        What Our Users Say
      </h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {feedback.map((t, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800/90 p-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105"
            data-aos="fade-up"
            data-aos-delay={idx * 100}
          >
            <div className="flex items-center gap-4 mb-4">
              <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full" />
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white">{t.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t.role}</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">{t.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
