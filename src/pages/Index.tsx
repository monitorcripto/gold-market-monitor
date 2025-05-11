
import Navbar from "@/components/Navbar";
import AlertBanner from "@/components/AlertBanner";
import CryptoCard from "@/components/CryptoCard";
import DatabaseConnectionTest from "@/components/DatabaseConnectionTest";

const Index = () => {
  // Create mock crypto data objects that match the expected CryptoData interface
  const mockCryptoData = [
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "btc",
      image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      current_price: 173245.67,
      price_change_percentage_24h: 2.34,
      total_volume: 9873456789,
      market_cap: 0,
      market_cap_rank: 1,
      high_24h: 0,
      low_24h: 0,
      circulating_supply: 0
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "eth",
      image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      current_price: 10256.78,
      price_change_percentage_24h: -1.45,
      total_volume: 5432987654,
      market_cap: 0,
      market_cap_rank: 2,
      high_24h: 0,
      low_24h: 0,
      circulating_supply: 0
    },
    {
      id: "cardano",
      name: "Cardano",
      symbol: "ada",
      image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
      current_price: 3.78,
      price_change_percentage_24h: 5.67,
      total_volume: 2345678901,
      market_cap: 0,
      market_cap_rank: 3,
      high_24h: 0,
      low_24h: 0,
      circulating_supply: 0
    },
    {
      id: "solana",
      name: "Solana",
      symbol: "sol",
      image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
      current_price: 567.89,
      price_change_percentage_24h: 10.23,
      total_volume: 1987654321,
      market_cap: 0,
      market_cap_rank: 4,
      high_24h: 0,
      low_24h: 0,
      circulating_supply: 0
    },
    {
      id: "ripple",
      name: "Ripple",
      symbol: "xrp",
      image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
      current_price: 2.45,
      price_change_percentage_24h: -3.21,
      total_volume: 3456789012,
      market_cap: 0,
      market_cap_rank: 5,
      high_24h: 0,
      low_24h: 0,
      circulating_supply: 0
    },
    {
      id: "polkadot",
      name: "Polkadot",
      symbol: "dot",
      image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
      current_price: 45.67,
      price_change_percentage_24h: 4.56,
      total_volume: 1234567890,
      market_cap: 0,
      market_cap_rank: 6,
      high_24h: 0,
      low_24h: 0,
      circulating_supply: 0
    }
  ];

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
          {mockCryptoData.map(crypto => (
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
