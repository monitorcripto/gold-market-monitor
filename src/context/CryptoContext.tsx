
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

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
  const [apiFailureCount, setApiFailureCount] = useState(0);

  const fetchCryptoData = async (showToast: boolean = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Attempting to fetch crypto data from CoinGecko API...");
      
      // Try to fetch from CoinGecko API with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h,7d",
        {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
          }
        }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data: CryptoData[] = await response.json();
      
      if (!data || data.length === 0) {
        throw new Error("No data received from API");
      }
      
      console.log("Successfully fetched crypto data from API");
      setCryptoData(data);
      setApiFailureCount(0); // Reset failure count on success
      
      // Set Bitcoin as default selected crypto if none is selected
      if (!selectedCrypto && data.length > 0) {
        setSelectedCrypto(data[0]);
        fetchChartData(data[0].id, chartTimeframe, false); // Don't show toast for initial load
      }
      
      if (showToast) {
        toast({
          title: "Dados atualizados",
          description: "Informações das criptomoedas foram atualizadas com sucesso.",
        });
      }
      
    } catch (error) {
      console.error("Failed to fetch crypto data:", error);
      setApiFailureCount(prev => prev + 1);
      
      // Only show error toast if this is a manual refresh or after multiple failures
      if (showToast || apiFailureCount >= 3) {
        setError("Falha ao carregar dados da API. Usando dados de demonstração.");
        toast({
          title: "Modo demonstração",
          description: "Usando dados simulados devido a limitações da API.",
          variant: "destructive"
        });
      }
      
      // Use mock data if API fails
      console.log("Using mock data as fallback...");
      useMockData();
    } finally {
      setIsLoading(false);
    }
  };

  const useMockData = () => {
    console.log("Loading mock cryptocurrency data...");
    
    // Enhanced mock data for demonstration purposes
    const mockData: CryptoData[] = [
      {
        id: "bitcoin",
        symbol: "btc",
        name: "Bitcoin",
        image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
        current_price: 105784,
        market_cap: 2102573250571,
        market_cap_rank: 1,
        price_change_percentage_24h: 0.19,
        price_change_percentage_7d: 1.37,
        total_volume: 15831366701,
        high_24h: 105891,
        low_24h: 105112,
        circulating_supply: 19876015
      },
      {
        id: "ethereum",
        symbol: "eth",
        name: "Ethereum",
        image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
        current_price: 2512,
        market_cap: 303292354577,
        market_cap_rank: 2,
        price_change_percentage_24h: 0.07,
        price_change_percentage_7d: 0.64,
        total_volume: 9297072081,
        high_24h: 2540,
        low_24h: 2496,
        circulating_supply: 120723050
      },
      {
        id: "tether",
        symbol: "usdt",
        name: "Tether",
        image: "https://assets.coingecko.com/coins/images/325/large/Tether.png",
        current_price: 1.0,
        market_cap: 154816475597,
        market_cap_rank: 3,
        price_change_percentage_24h: -0.01,
        price_change_percentage_7d: 0.00,
        total_volume: 28771474576,
        high_24h: 1.0,
        low_24h: 1.0,
        circulating_supply: 154760836092
      },
      {
        id: "ripple",
        symbol: "xrp", 
        name: "XRP",
        image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
        current_price: 2.27,
        market_cap: 133505752500,
        market_cap_rank: 4,
        price_change_percentage_24h: 3.80,
        price_change_percentage_7d: 6.01,
        total_volume: 1727727876,
        high_24h: 2.28,
        low_24h: 2.17,
        circulating_supply: 58821652442
      },
      {
        id: "binancecoin",
        symbol: "bnb",
        name: "BNB", 
        image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
        current_price: 651,
        market_cap: 95019034449,
        market_cap_rank: 5,
        price_change_percentage_24h: 0.07,
        price_change_percentage_7d: 0.02,
        total_volume: 401972037,
        high_24h: 654,
        low_24h: 647,
        circulating_supply: 145887576
      }
    ];
    
    setCryptoData(mockData);
    if (!selectedCrypto) {
      setSelectedCrypto(mockData[0]);
      useMockChartData();
    }
  };

  const fetchChartData = async (id: string, timeframe: '1d' | '7d' | '30d' | '90d' = chartTimeframe, showToast: boolean = false) => {
    try {
      console.log(`Fetching chart data for ${id} with timeframe ${timeframe}...`);
      
      // Map timeframe to days
      const days = timeframe === '1d' ? 1 : timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
      
      // Try to fetch chart data from CoinGecko API with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
      
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`,
        {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
          }
        }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Chart API error: ${response.status} ${response.statusText}`);
      }
      
      const data: CryptoChartData = await response.json();
      
      if (!data.prices || data.prices.length === 0) {
        throw new Error("No chart data received");
      }
      
      console.log("Successfully fetched chart data from API");
      setChartData(data);
      
    } catch (error) {
      console.error("Failed to fetch chart data:", error);
      
      // Only show toast for manual refresh
      if (showToast) {
        toast({
          title: "Dados do gráfico indisponíveis",
          description: "Usando dados simulados para o gráfico.",
        });
      }
      
      // Use mock chart data
      console.log("Using mock chart data as fallback...");
      useMockChartData();
    }
  };

  const useMockChartData = () => {
    console.log("Generating mock chart data...");
    
    // Generate realistic mock chart data
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    const mockPrices: [number, number][] = [];
    
    const timeframeMap = { '1d': 1, '7d': 7, '30d': 30, '90d': 90 };
    const daysToGenerate = timeframeMap[chartTimeframe];
    
    // Generate price data based on selected crypto
    const basePrice = selectedCrypto?.current_price || 50000;
    
    for (let i = daysToGenerate; i >= 0; i--) {
      const timestamp = now - (i * day);
      // Add some realistic price movement
      const trend = Math.sin((i / daysToGenerate) * Math.PI) * 0.1;
      const noise = (Math.random() - 0.5) * 0.05;
      const priceMultiplier = 1 + trend + noise;
      const price = basePrice * priceMultiplier;
      mockPrices.push([timestamp, price]);
    }
    
    // Create corresponding market cap and volume data
    const mockMarketCaps: [number, number][] = mockPrices.map(([time, price]) => 
      [time, price * (selectedCrypto?.circulating_supply || 19876015)]
    );
    
    const mockVolumes: [number, number][] = mockPrices.map(([time]) => 
      [time, Math.random() * 50000000000 + 10000000000] // Random volume between 10B-60B
    );
    
    setChartData({
      prices: mockPrices,
      market_caps: mockMarketCaps,
      total_volumes: mockVolumes,
    });
  };

  const refreshData = async () => {
    console.log("Manual data refresh triggered");
    await fetchCryptoData(true); // Show toast for manual refresh
    if (selectedCrypto) {
      await fetchChartData(selectedCrypto.id, chartTimeframe, true);
    }
  };

  // Initial data fetch
  useEffect(() => {
    console.log("Initial data fetch on component mount");
    fetchCryptoData(false); // Don't show toast for initial load
    
    // Set up interval for periodic data refresh (every 5 minutes to avoid rate limits)
    const interval = setInterval(() => {
      console.log("Periodic data refresh triggered");
      fetchCryptoData(false); // Don't show toast for automatic refresh
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(interval);
  }, []);

  // Update chart when selected crypto or timeframe changes
  useEffect(() => {
    if (selectedCrypto) {
      console.log(`Chart data update for ${selectedCrypto.id} with timeframe ${chartTimeframe}`);
      fetchChartData(selectedCrypto.id, chartTimeframe, false);
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
