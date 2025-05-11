import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d?: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  circulating_supply: number;
}

export interface CryptoChartData {
  prices: [number, number][]; // [timestamp, price]
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

interface CryptoContextType {
  cryptoData: CryptoData[];
  isLoading: boolean;
  error: string | null;
  selectedCrypto: CryptoData | null;
  setSelectedCrypto: (crypto: CryptoData | null) => void;
  chartData: CryptoChartData | null;
  chartTimeframe: '1d' | '7d' | '30d' | '90d';
  setChartTimeframe: (timeframe: '1d' | '7d' | '30d' | '90d') => void;
  fetchChartData: (id: string, timeframe?: '1d' | '7d' | '30d' | '90d') => Promise<void>;
  refreshData: () => Promise<void>;
}

const CryptoContext = createContext<CryptoContextType | undefined>(undefined);

export const CryptoProvider = ({ children }: { children: React.ReactNode }) => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoData | null>(null);
  const [chartData, setChartData] = useState<CryptoChartData | null>(null);
  const [chartTimeframe, setChartTimeframe] = useState<'1d' | '7d' | '30d' | '90d'>('7d');

  const fetchCryptoData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch top cryptocurrencies from CoinGecko API
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h,7d"
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data: CryptoData[] = await response.json();
      setCryptoData(data);
      
      // Set Bitcoin as default selected crypto if none is selected
      if (!selectedCrypto && data.length > 0) {
        setSelectedCrypto(data[0]);
        fetchChartData(data[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch crypto data:", error);
      setError("Failed to load cryptocurrency data. Please try again later.");
      toast.error("Failed to load data");
      
      // Use mock data if API fails
      useMockData();
    } finally {
      setIsLoading(false);
    }
  };

  const useMockData = () => {
    // Mock data for demonstration purposes
    const mockData: CryptoData[] = [
      {
        id: "bitcoin",
        symbol: "btc",
        name: "Bitcoin",
        image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
        current_price: 57000,
        market_cap: 1100000000000,
        market_cap_rank: 1,
        price_change_percentage_24h: 2.5,
        price_change_percentage_7d: 5.3,
        total_volume: 32000000000,
        high_24h: 57500,
        low_24h: 55800,
        circulating_supply: 19000000
      },
      {
        id: "ethereum",
        symbol: "eth",
        name: "Ethereum",
        image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
        current_price: 2500,
        market_cap: 300000000000,
        market_cap_rank: 2,
        price_change_percentage_24h: 1.8,
        price_change_percentage_7d: 3.2,
        total_volume: 15000000000,
        high_24h: 2550,
        low_24h: 2450,
        circulating_supply: 120000000
      }
    ];
    
    setCryptoData(mockData);
    if (!selectedCrypto) {
      setSelectedCrypto(mockData[0]);
    }
  };

  const fetchChartData = async (id: string, timeframe: '1d' | '7d' | '30d' | '90d' = chartTimeframe) => {
    try {
      setIsLoading(true);
      
      // Map timeframe to days
      const days = timeframe === '1d' ? 1 : timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
      
      // Fetch chart data from CoinGecko API
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data: CryptoChartData = await response.json();
      setChartData(data);
    } catch (error) {
      console.error("Failed to fetch chart data:", error);
      // Use mock chart data
      useMockChartData();
    } finally {
      setIsLoading(false);
    }
  };

  const useMockChartData = () => {
    // Generate mock chart data for demonstration
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    const mockPrices: [number, number][] = [];
    
    // Generate 90 days of mock price data
    for (let i = 90; i >= 0; i--) {
      const timestamp = now - (i * day);
      const basePrice = selectedCrypto?.id === 'bitcoin' ? 57000 : 2500;
      const variation = (Math.random() - 0.5) * 0.05 * basePrice; // +/- 5%
      mockPrices.push([timestamp, basePrice + variation]);
    }
    
    // Create mock market cap and volume data based on price
    const mockMarketCaps: [number, number][] = mockPrices.map(([time, price]) => 
      [time, price * (selectedCrypto?.id === 'bitcoin' ? 19000000 : 120000000)]
    );
    
    const mockVolumes: [number, number][] = mockPrices.map(([time]) => 
      [time, Math.random() * 10000000000 + 5000000000]
    );
    
    setChartData({
      prices: mockPrices,
      market_caps: mockMarketCaps,
      total_volumes: mockVolumes,
    });
  };

  const refreshData = async () => {
    await fetchCryptoData();
    if (selectedCrypto) {
      await fetchChartData(selectedCrypto.id);
    }
    toast.success("Data refreshed");
  };

  // Initial data fetch
  useEffect(() => {
    fetchCryptoData();
    // Set up interval for periodic data refresh (every 60 seconds)
    const interval = setInterval(() => {
      fetchCryptoData();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Update chart when selected crypto or timeframe changes
  useEffect(() => {
    if (selectedCrypto) {
      fetchChartData(selectedCrypto.id, chartTimeframe);
    }
  }, [selectedCrypto?.id, chartTimeframe]);

  return (
    <CryptoContext.Provider value={{
      cryptoData,
      isLoading,
      error,
      selectedCrypto,
      setSelectedCrypto,
      chartData,
      chartTimeframe,
      setChartTimeframe,
      fetchChartData,
      refreshData
    }}>
      {children}
    </CryptoContext.Provider>
  );
};

export const useCrypto = () => {
  const context = useContext(CryptoContext);
  if (context === undefined) {
    throw new Error("useCrypto must be used within a CryptoProvider");
  }
  return context;
};
