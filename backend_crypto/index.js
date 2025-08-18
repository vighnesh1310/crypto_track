const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// 🚀 Increase limit to 10MB or more
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware
app.use(express.json());

// ✅ CORS setup for React frontend (http://localhost:3000)
app.use(cors({
  //origin: 'https://crypto-track-xi.vercel.app' ||'http://localhost:3000',
  origin: 'http://localhost:3000',
  credentials: true
}));

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profile');
const dashboardRoutes = require('./routes/dashboard');
const watchlistRoutes = require('./routes/watchlist');
const portfolioRoutes = require('./routes/portfolio');
const marketRoute = require('./routes/market');
const alertRoutes = require('./routes/alerts');
const paymentsRoutes = require('./routes/payments');



app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/market', marketRoute);
app.use('/api/alerts', alertRoutes);
app.use('/api/payments', paymentsRoutes);

// Root endpoint for testing
app.get('/', (req, res) => {
  res.send('🚀 CryptoTrack API is running');
});

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('✅ MongoDB Connected');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
