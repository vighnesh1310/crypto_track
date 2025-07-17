import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { MarketTable } from '../components/MarketTable';
import { Testimonials } from '../components/Testimonials';
import { FAQs } from '../components/FAQs';
import { Footer } from '../components/Footer';

export function Home() {
  const reveal = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header showProfileDropdown showMobileMenu />

      <main className="space-y-16 my-10">
        <HeroSection />

        <motion.div initial="hidden" whileInView="visible" variants={reveal} viewport={{ once: true }}>
          <MarketTable />
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" variants={reveal} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          <Testimonials />
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" variants={reveal} viewport={{ once: true }} transition={{ delay: 0.4 }}>
          <FAQs />
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
