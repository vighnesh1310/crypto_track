import React from 'react';
import Lottie from 'lottie-react';
import { motion } from 'framer-motion';
import heroAnimation from '../assets/crypto2.json';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 px-6 sm:px-10">
      {/* Glass Background Layer */}
      <div className="absolute inset-0 bg-white/20 dark:bg-gray-800/30 backdrop-blur-lg z-0 rounded-xl" />

      <motion.div
        className="relative z-10 flex flex-col-reverse lg:flex-row items-center justify-between"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Left Content */}
        <div className="max-w-xl text-center lg:text-left space-y-6">
          <motion.h1
            className="text-4xl sm:text-5xl font-extrabold leading-tight text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Track, Analyze & Trade Crypto in Real-Time
          </motion.h1>

          <motion.p
            className="text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Stay ahead of the market with live prices, smart alerts, and powerful portfolio tools — all in one place.
          </motion.p>

          <motion.div
            className="space-x-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <a
              href="/login"
              className="inline-block px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow transition-transform hover:scale-105"
            >
              🚀 Get Started
            </a>
            <a
              href="/market"
              className="inline-block px-6 py-3 border border-indigo-600 text-indigo-600 dark:text-white dark:border-white rounded-full hover:bg-indigo-100 dark:hover:bg-white/10 transition-transform hover:scale-105"
            >
              📊 Explore Market
            </a>
          </motion.div>
        </div>

        {/* Right Lottie Animation */}
        <motion.div
          className="w-full lg:w-1/2 mb-10 lg:mb-0"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <Lottie animationData={heroAnimation} loop className="max-w-md mx-auto" />
        </motion.div>
      </motion.div>
    </section>
  );
}
