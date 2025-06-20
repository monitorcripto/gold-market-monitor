import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import CryptoChart from "@/components/CryptoChart";
import FearGreedIndex from "@/components/FearGreedIndex";
import TechnicalIndicators from "@/components/TechnicalIndicators";
import TradingSignals from "@/components/TradingSignals";
import RiskAnalysis from "@/components/RiskAnalysis";
import SmartAlerts from "@/components/SmartAlerts";
import DecisionDashboard from "@/components/DecisionDashboard";
import TrendIndicator from "@/components/TrendIndicator";
import MarketStat from "./MarketStat";
import { CryptoData } from "@/context/CryptoContext";
import { formatCurrency } from "@/lib/utils";
import RiskWarning from "@/components/RiskWarning";

interface AnalysisTabsProps {
  selectedCrypto: CryptoData | null;
  isLoading: boolean;
}

const AnalysisTabs = ({ selectedCrypto, isLoading }: AnalysisTabsProps) => {
  return (
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
                      tooltip="O preço atual da criptomoeda no mercado em tempo real"
                    />
                    <MarketStat 
                      label="Capitalização de Mercado" 
                      value={formatCurrency(selectedCrypto.market_cap)} 
                      tooltip="Valor total de todas as moedas em circulação (preço × quantidade total de moedas)"
                    />
                    <MarketStat 
                      label="Ranking" 
                      value={`#${selectedCrypto.market_cap_rank}`} 
                      tooltip="Posição da criptomoeda no ranking por capitalização de mercado"
                    />
                    <MarketStat 
                      label="Volume 24h" 
                      value={formatCurrency(selectedCrypto.total_volume)} 
                      tooltip="Valor total negociado nas últimas 24 horas em todas as exchanges"
                    />
                    <MarketStat 
                      label="Máxima 24h" 
                      value={formatCurrency(selectedCrypto.high_24h)} 
                      tooltip="Maior preço atingido nas últimas 24 horas"
                    />
                    <MarketStat 
                      label="Mínima 24h" 
                      value={formatCurrency(selectedCrypto.low_24h)} 
                      tooltip="Menor preço atingido nas últimas 24 horas"
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
                      tooltip="Percentual de variação do preço nas últimas 24 horas"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <RiskWarning />
        </TabsContent>

        <TabsContent value="technical" className="space-y-6">
          {selectedCrypto ? (
            <>
              <TechnicalIndicators crypto={selectedCrypto} />
              <RiskWarning />
            </>
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
            <>
              <TradingSignals crypto={selectedCrypto} />
              <RiskWarning />
            </>
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
            <>
              <RiskAnalysis crypto={selectedCrypto} />
              <RiskWarning />
            </>
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
            <>
              <SmartAlerts crypto={selectedCrypto} />
              <RiskWarning />
            </>
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
  );
};

export default AnalysisTabs;
