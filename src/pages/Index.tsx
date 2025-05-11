
import Navbar from "@/components/Navbar";
import AlertBanner from "@/components/AlertBanner";
import CryptoCard from "@/components/CryptoCard";
import DatabaseConnectionTest from "@/components/DatabaseConnectionTest";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <AlertBanner />
        
        {/* Seção de teste de conexão com o banco de dados */}
        <div className="mb-8">
          <DatabaseConnectionTest />
        </div>
        
        <h1 className="text-3xl font-bold mb-6">Dashboard Cripto</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CryptoCard 
            name="Bitcoin" 
            symbol="BTC" 
            price={173245.67} 
            change={2.34} 
            volume={9873456789}
          />
          <CryptoCard 
            name="Ethereum" 
            symbol="ETH" 
            price={10256.78} 
            change={-1.45} 
            volume={5432987654}
          />
          <CryptoCard 
            name="Cardano" 
            symbol="ADA" 
            price={3.78} 
            change={5.67} 
            volume={2345678901}
          />
          <CryptoCard 
            name="Solana" 
            symbol="SOL" 
            price={567.89} 
            change={10.23} 
            volume={1987654321}
          />
          <CryptoCard 
            name="Ripple" 
            symbol="XRP" 
            price={2.45} 
            change={-3.21} 
            volume={3456789012}
          />
          <CryptoCard 
            name="Polkadot" 
            symbol="DOT" 
            price={45.67} 
            change={4.56} 
            volume={1234567890}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
