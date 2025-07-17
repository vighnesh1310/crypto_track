module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(-5px)'  },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        sm: '4px',
        md: '8px',
      },
      colors: {
        whiteAlpha: {
          50: 'rgba(255,255,255,0.05)',
          100: 'rgba(255,255,255,0.1)',
          // Add more if needed
        },
      },
    },
  },
  plugins: [],
};
