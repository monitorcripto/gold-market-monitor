
import Navbar from "@/components/Navbar";
import AlertBanner from "@/components/AlertBanner";
import CryptoCard from "@/components/CryptoCard";
import { useCrypto } from "@/context/CryptoContext";

const Index = () => {
  const { cryptoData } = useCrypto();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <AlertBanner />
        
        <h1 className="text-3xl font-bold mb-6">Dashboard Cripto</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cryptoData.map(crypto => (
            <CryptoCard 
              key={crypto.id}
              crypto={crypto}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
