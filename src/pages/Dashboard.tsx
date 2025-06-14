
import { useState } from "react";
import Navbar from "@/components/Navbar";
import AlertBanner from "@/components/AlertBanner";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import TopCryptocurrencies from "@/components/dashboard/TopCryptocurrencies";
import AnalysisTabs from "@/components/dashboard/AnalysisTabs";
import AllCryptocurrenciesSection from "@/components/dashboard/AllCryptocurrenciesSection";
import DashboardFooter from "@/components/dashboard/DashboardFooter";
import { CryptoProvider, useCrypto } from "@/context/CryptoContext";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const DashboardContent = () => {
  const { 
    cryptoData, 
    isLoading, 
    selectedCrypto, 
    setSelectedCrypto,
    refreshData
  } = useCrypto();
  const [refreshing, setRefreshing] = useState(false);
  const { isAuthenticated } = useAuth();
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setTimeout(() => setRefreshing(false), 500);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="container px-4 py-8 flex-grow max-w-7xl">
        <DashboardHeader 
          refreshing={refreshing} 
          onRefresh={handleRefresh} 
        />
        
        <AlertBanner />
        
        <TopCryptocurrencies 
          cryptoData={cryptoData}
          isLoading={isLoading}
          selectedCrypto={selectedCrypto}
          onCryptoSelect={setSelectedCrypto}
        />

        <AnalysisTabs 
          selectedCrypto={selectedCrypto}
          isLoading={isLoading}
        />
        
        <AllCryptocurrenciesSection 
          cryptoData={cryptoData}
          isLoading={isLoading}
          onCryptoSelect={setSelectedCrypto}
        />
      </main>
      
      <DashboardFooter />
    </div>
  );
};

// Wrapped component with CryptoProvider
const Dashboard = () => (
  <CryptoProvider>
    <DashboardContent />
  </CryptoProvider>
);

export default Dashboard;
