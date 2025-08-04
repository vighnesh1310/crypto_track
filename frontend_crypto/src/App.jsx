// App.jsx
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { SidebarProvider } from './context/SidebarContext';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext'; // ✅ Import this
import { CurrencyProvider } from './context/CurrencyContext'; // ✅ if syncing currency globally

import { ProtectedRoute } from './components/ProtectedRoute';
import { RedirectIfAuth } from './components/RedirectIfAuth';
import { Toaster } from 'react-hot-toast';

import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Portfolio } from './pages/Portfolio';
import { Alerts } from './pages/Alerts';
import { Market } from './pages/Market';
import { Watchlist } from './pages/Watchlist';
import { NewsCard } from './components/NewsCard';
import { CoinDetail } from './pages/CoinDetails';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { BuyModal } from './components/BuyModal'; // ✅ correct for named export


export default function App() {
  return (
    <UserProvider> {/* ✅ Wrap UserProvider at top */}
      <ThemeProvider> {/* ✅ Theme now can use user.settings.darkMode */}
        <SidebarProvider>
          <CurrencyProvider> {/* ✅ optional, for global currency context */}
            <Router>
              <Toaster position="top-right" reverseOrder={false} />
              <ToastContainer position="top-right" autoClose={3000} theme="colored" />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<RedirectIfAuth><Login /></RedirectIfAuth>} />
                <Route path="/register" element={<RedirectIfAuth><Register /></RedirectIfAuth>} />

                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
                <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
                <Route path="/market" element={<ProtectedRoute><Market /></ProtectedRoute>} />
                <Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
                <Route path="/coin/:coinId" element={<CoinDetail />} />
                <Route path="/newscard" element={<NewsCard />} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/buy" element={<ProtectedRoute><BuyModal /></ProtectedRoute>} />
              </Routes>
            </Router>
          </CurrencyProvider>
        </SidebarProvider>
      </ThemeProvider>
    </UserProvider>
  );
}
