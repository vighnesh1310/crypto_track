// pages/Dashboard.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { SummaryCards } from '../components/SummaryCards';
import { PriceTable } from '../components/PriceTable';
import { PortfolioChart } from '../components/PortfolioChart';
import { NewsSection } from '../components/NewsSection';
import { WalletOverview } from '../components/WalletOverview';
import { TrendingCoins } from '../components/TrendingCoins';
import { AlertsPanel } from '../components/AlertsPanel';
import { Footer } from '../components/Footer';
import { useSidebar } from '../context/SidebarContext';

export function Dashboard() {
  const navigate = useNavigate();
  const { isOpen } = useSidebar();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex">
      <Sidebar />
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isOpen ? 'ml-64' : 'ml-16'
        }`}
      >
        <Topbar />
        <main className="p-4 sm:p-6 space-y-10 max-w-screen-2xl mx-auto w-full">
  <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
    <SummaryCards />
  </section>

  <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <WalletOverview />
    <TrendingCoins />
  </section>

  <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2 overflow-x-auto">
      <PriceTable />
    </div>
    <PortfolioChart />
  </section>

  <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <AlertsPanel />
    <NewsSection />
  </section>

  
</main>

        <Footer />
      </div>
    </div>
  );
}
