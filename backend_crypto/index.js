const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// ✅ CORS setup for React frontend (http://localhost:3000)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profile');
const tradeRoutes = require('./routes/trade');
const dashboardRoutes = require('./routes/dashboard');
const watchlistRoutes = require('./routes/watchlist');
const portfolioRoutes = require('./routes/portfolio');
const marketRoute = require('./routes/market');
const alertRoutes = require('./routes/alerts');


app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/trade', tradeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/market', marketRoute);
app.use('/api/alerts', alertRoutes);

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
