const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

app.use('/api/user', require('./routes/userRoutes'));

const profileRoute = require('./routes/profile');
app.use('/api/profile', profileRoute);

const tradeRoutes = require('./routes/trade');
app.use('/api/trade', tradeRoutes);

const dashboardRoutes = require('./routes/dashboard');
app.use('/api/dashboard', dashboardRoutes);

const watchlistRoutes = require('./routes/watchlist');
app.use('/api/watchlist', watchlistRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log(err));
