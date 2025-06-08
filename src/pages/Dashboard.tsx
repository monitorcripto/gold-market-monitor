import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import CryptoCard from "@/components/CryptoCard";
import CryptoChart from "@/components/CryptoChart";
import TrendIndicator from "@/components/TrendIndicator";
import AlertBanner from "@/components/AlertBanner";
import FearGreedIndex from "@/components/FearGreedIndex";
import TechnicalIndicators from "@/components/TechnicalIndicators";
import TradingSignals from "@/components/TradingSignals";
import RiskAnalysis from "@/components/RiskAnalysis";
import SmartAlerts from "@/components/SmartAlerts";
import DecisionDashboard from "@/components/DecisionDashboard";
import { CryptoProvider, useCrypto } from "@/context/CryptoContext";
import { formatCurrency } from "@/lib/utils";
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

  const topCryptos = cryptoData.slice(0, 5);
  const allCryptos = cryptoData.slice(0, 20);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="container px-4 py-8 flex-grow max-w-7xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Centro de Análise Cripto</h1>
            <p className="text-muted-foreground">
              Análise completa com indicadores técnicos, sinais de trading e gestão de risco
            </p>
          </div>
          <Button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="mt-4 lg:mt-0"
          >
            {refreshing ? "Atualizando..." : "Atualizar Dados"}
          </Button>
        </div>
        
        <AlertBanner />
        
        {/* Top cryptocurrencies row */}
        <section className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Top Criptomoedas</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))
            ) : (
              topCryptos.map((crypto) => (
                <CryptoCard
                  key={crypto.id}
                  crypto={crypto}
                  isSelected={selectedCrypto?.id === crypto.id}
                  onClick={() => setSelectedCrypto(crypto)}
                />
              ))
            )}
          </div>
        </section>

        {/* Analysis Tabs */}
        <section className="mt-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="technical">Técnica</TabsTrigger>
              <TabsTrigger value="signals">Sinais</TabsTrigger>
              <TabsTrigger value="risk">Risco</TabsTrigger>
              <TabsTrigger value="alerts">Alertas</TabsTrigger>
              <TabsTrigger value="decision">Decisão</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart and Basic Stats */}
                <div className="space-y-6">
                  <CryptoChart />
                  <FearGreedIndex />
                </div>
                
                {/* Market stats panel */}
                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle>Dados de Mercado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading || !selectedCrypto ? (
                      <div className="space-y-3">
                        {Array(6).fill(0).map((_, i) => (
                          <Skeleton key={i} className="h-6" />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <MarketStat 
                          label="Preço Atual" 
                          value={formatCurrency(selectedCrypto.current_price)} 
                        />
                        <MarketStat 
                          label="Capitalização de Mercado" 
                          value={formatCurrency(selectedCrypto.market_cap)} 
                        />
                        <MarketStat 
                          label="Ranking" 
                          value={`#${selectedCrypto.market_cap_rank}`} 
                        />
                        <MarketStat 
                          label="Volume 24h" 
                          value={formatCurrency(selectedCrypto.total_volume)} 
                        />
                        <MarketStat 
                          label="Máxima 24h" 
                          value={formatCurrency(selectedCrypto.high_24h)} 
                        />
                        <MarketStat 
                          label="Mínima 24h" 
                          value={formatCurrency(selectedCrypto.low_24h)} 
                        />
                        <Separator className="my-2" />
                        <MarketStat 
                          label="Variação 24h" 
                          value={
                            <TrendIndicator 
                              value={selectedCrypto.price_change_percentage_24h} 
                              asPercentage 
                              showIcon 
                            />
                          } 
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="technical" className="space-y-6">
              {selectedCrypto ? (
                <TechnicalIndicators crypto={selectedCrypto} />
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">Selecione uma criptomoeda para ver os indicadores técnicos</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="signals" className="space-y-6">
              {selectedCrypto ? (
                <TradingSignals crypto={selectedCrypto} />
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">Selecione uma criptomoeda para ver os sinais de trading</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="risk" className="space-y-6">
              {selectedCrypto ? (
                <RiskAnalysis crypto={selectedCrypto} />
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">Selecione uma criptomoeda para ver a análise de risco</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="alerts" className="space-y-6">
              {selectedCrypto ? (
                <SmartAlerts crypto={selectedCrypto} />
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">Selecione uma criptomoeda para configurar alertas</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="decision" className="space-y-6">
              {selectedCrypto ? (
                <DecisionDashboard crypto={selectedCrypto} />
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">Selecione uma criptomoeda para ver o dashboard de decisão</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </section>
        
        {/* All cryptocurrencies section */}
        <section className="mt-8">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Todas as Criptomoedas</h2>
              <TabsList>
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="gainers">Em Alta</TabsTrigger>
                <TabsTrigger value="losers">Em Baixa</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="space-y-4">
              <div className="bg-card rounded-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted">
                        <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-8">#</th>
                        <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Nome</th>
                        <th className="p-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Preço</th>
                        <th className="p-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">24h %</th>
                        <th className="p-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Cap. de Mercado</th>
                        <th className="p-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Volume</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        Array(10).fill(0).map((_, i) => (
                          <tr key={i} className="border-b border-border">
                            <td colSpan={6} className="p-3">
                              <Skeleton className="h-6 w-full" />
                            </td>
                          </tr>
                        ))
                      ) : (
                        allCryptos.map((crypto) => (
                          <tr 
                            key={crypto.id} 
                            className="border-b border-border hover:bg-muted/50 cursor-pointer"
                            onClick={() => setSelectedCrypto(crypto)}
                          >
                            <td className="p-4 whitespace-nowrap">{crypto.market_cap_rank}</td>
                            <td className="p-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <img src={crypto.image} alt={crypto.name} className="w-6 h-6 mr-3" />
                                <div>
                                  <div className="font-medium">{crypto.name}</div>
                                  <div className="text-xs text-muted-foreground uppercase">{crypto.symbol}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-right whitespace-nowrap font-medium">
                              {formatCurrency(crypto.current_price)}
                            </td>
                            <td className="p-4 text-right whitespace-nowrap">
                              <TrendIndicator
                                value={crypto.price_change_percentage_24h}
                                asPercentage
                                showIcon
                              />
                            </td>
                            <td className="p-4 text-right whitespace-nowrap">
                              {formatCurrency(crypto.market_cap)}
                            </td>
                            <td className="p-4 text-right whitespace-nowrap">
                              {formatCurrency(crypto.total_volume)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="gainers">
              <div className="bg-card rounded-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted">
                        <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-8">#</th>
                        <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Nome</th>
                        <th className="p-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Preço</th>
                        <th className="p-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">24h %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td colSpan={4} className="p-4 text-center">Carregando...</td>
                        </tr>
                      ) : (
                        cryptoData
                          .filter(crypto => crypto.price_change_percentage_24h > 0)
                          .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
                          .slice(0, 10)
                          .map((crypto) => (
                            <tr 
                              key={crypto.id} 
                              className="border-b border-border hover:bg-muted/50 cursor-pointer"
                              onClick={() => setSelectedCrypto(crypto)}
                            >
                              <td className="p-4 whitespace-nowrap">{crypto.market_cap_rank}</td>
                              <td className="p-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <img src={crypto.image} alt={crypto.name} className="w-6 h-6 mr-3" />
                                  <div>
                                    <div className="font-medium">{crypto.name}</div>
                                    <div className="text-xs text-muted-foreground uppercase">{crypto.symbol}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 text-right whitespace-nowrap font-medium">
                                {formatCurrency(crypto.current_price)}
                              </td>
                              <td className="p-4 text-right whitespace-nowrap">
                                <TrendIndicator
                                  value={crypto.price_change_percentage_24h}
                                  asPercentage
                                  showIcon
                                />
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="losers">
              <div className="bg-card rounded-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted">
                        <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-8">#</th>
                        <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Nome</th>
                        <th className="p-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Preço</th>
                        <th className="p-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">24h %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td colSpan={4} className="p-4 text-center">Carregando...</td>
                        </tr>
                      ) : (
                        cryptoData
                          .filter(crypto => crypto.price_change_percentage_24h < 0)
                          .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
                          .slice(0, 10)
                          .map((crypto) => (
                            <tr 
                              key={crypto.id} 
                              className="border-b border-border hover:bg-muted/50 cursor-pointer"
                              onClick={() => setSelectedCrypto(crypto)}
                            >
                              <td className="p-4 whitespace-nowrap">{crypto.market_cap_rank}</td>
                              <td className="p-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <img src={crypto.image} alt={crypto.name} className="w-6 h-6 mr-3" />
                                  <div>
                                    <div className="font-medium">{crypto.name}</div>
                                    <div className="text-xs text-muted-foreground uppercase">{crypto.symbol}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 text-right whitespace-nowrap font-medium">
                                {formatCurrency(crypto.current_price)}
                              </td>
                              <td className="p-4 text-right whitespace-nowrap">
                                <TrendIndicator
                                  value={crypto.price_change_percentage_24h}
                                  asPercentage
                                  showIcon
                                />
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>
      
      <footer className="border-t border-border py-6 bg-background">
        <div className="container px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="font-bold text-lg bg-gradient-to-r from-crypto-green-500 to-crypto-gold-500 bg-clip-text text-transparent">
                Monitor Cripto
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                © {new Date().getFullYear()} Monitor Cripto. Todos os direitos reservados.
              </p>
            </div>
            <div className="flex space-x-4 text-sm">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Termos de Uso
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Política de Privacidade
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Contato
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Helper components
interface MarketStatProps {
  label: string;
  value: React.ReactNode;
}

const MarketStat = ({ label, value }: MarketStatProps) => (
  <div className="flex justify-between items-center">
    <span className="text-muted-foreground text-sm">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

interface TrendBadgeProps {
  value: "bullish" | "bearish" | "neutral";
}

const TrendBadge = ({ value }: TrendBadgeProps) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
      value === "bullish"
        ? "bg-crypto-green-100 text-crypto-green-700"
        : value === "bearish"
        ? "bg-crypto-red-100 text-crypto-red-700"
        : "bg-crypto-gray-100 text-crypto-gray-700"
    }`}
  >
    {value === "bullish" ? "Alta" : value === "bearish" ? "Baixa" : "Neutro"}
  </span>
);

interface TechnicalIndicatorProps {
  name: string;
  value: number;
  type: "bullish" | "bearish" | "neutral" | "momentum" | "overbought" | "oversold";
}

const TechnicalIndicator = ({ name, value, type }: TechnicalIndicatorProps) => {
  let colorClass = "";
  let label = "";

  switch (type) {
    case "bullish":
      colorClass = "bg-crypto-green-100 text-crypto-green-700";
      label = "Compra";
      break;
    case "bearish":
      colorClass = "bg-crypto-red-100 text-crypto-red-700";
      label = "Venda";
      break;
    case "overbought":
      colorClass = "bg-crypto-red-100 text-crypto-red-700";
      label = "Sobrecomprado";
      break;
    case "oversold":
      colorClass = "bg-crypto-green-100 text-crypto-green-700";
      label = "Sobrevendido";
      break;
    case "momentum":
      if (value > 70) {
        colorClass = "bg-crypto-red-100 text-crypto-red-700";
        label = "Sobrecomprado";
      } else if (value < 30) {
        colorClass = "bg-crypto-green-100 text-crypto-green-700";
        label = "Sobrevendido";
      } else {
        colorClass = "bg-crypto-gray-100 text-crypto-gray-700";
        label = "Neutro";
      }
      break;
    default:
      colorClass = "bg-crypto-gray-100 text-crypto-gray-700";
      label = "Neutro";
  }

  return (
    <div className="flex items-center space-x-2">
      <span>{value.toFixed(2)}</span>
      <span
        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colorClass}`}
      >
        {label}
      </span>
    </div>
  );
};

// Helper functions for simulating technical indicators
const simulateRSI = (priceChange: number) => {
  // Simulate RSI based on price change percentage
  const baseRSI = 50; // Neutral base
  const change = priceChange * 2.5; // Scale the percentage change
  const simulatedRSI = baseRSI + change;
  
  // Clamp to valid RSI range
  return Math.max(0, Math.min(100, simulatedRSI));
};

const simulateMacd = (priceChange: number) => {
  // Simulate MACD signal value
  return priceChange * 0.3;
};

// Wrapped component with CryptoProvider
const Dashboard = () => (
  <CryptoProvider>
    <DashboardContent />
  </CryptoProvider>
);

export default Dashboard;
