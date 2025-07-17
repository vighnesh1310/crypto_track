import React from 'react';
import { Github, Twitter, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white/30 dark:bg-white/5 backdrop-blur-md border-t border-white/20 dark:border-white/10 text-sm py-6 text-gray-700 dark:text-gray-300 transition-all rounded-t-lg shadow-inner mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-center sm:text-left">
          &copy; {new Date().getFullYear()}{' '}
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">CryptoTrack</span>. All rights reserved.
        </p>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-500 hover:scale-110 transition duration-200"
          >
            <Github size={20} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-400 hover:scale-110 transition duration-200"
          >
            <Twitter size={20} />
          </a>
          <a
            href="mailto:support@cryptotrack.com"
            className="hover:text-rose-400 hover:scale-110 transition duration-200"
          >
            <Mail size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
