
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, TrendingDown, AlertCircle } from "lucide-react";
import { CryptoData } from "@/context/CryptoContext";
import { formatCurrency } from "@/lib/utils";

interface RiskAnalysisProps {
  crypto: CryptoData;
}

interface RiskMetric {
  name: string;
  value: number;
  level: 'low' | 'medium' | 'high';
  description: string;
  unit: string;
}

const RiskAnalysis = ({ crypto }: RiskAnalysisProps) => {
  const calculateRiskMetrics = (): RiskMetric[] => {
    const priceChange = crypto.price_change_percentage_24h;
    const volume = crypto.total_volume;
    const marketCap = crypto.market_cap;
    
    // Volatilidade histórica (simulada)
    const volatility = Math.abs(priceChange) + Math.random() * 5;
    
    // Value at Risk (VaR) - 5% chance de perder mais que este valor
    const var95 = Math.abs(priceChange) * 1.65; // 95% confidence interval
    
    // Correlação com Bitcoin (simulada)
    const btcCorrelation = crypto.id === 'bitcoin' ? 1 : 0.6 + (Math.random() * 0.4);
    
    // Drawdown máximo (simulado)
    const maxDrawdown = Math.max(5, Math.abs(priceChange) * 2);
    
    // Ratio Volume/Market Cap
    const volumeRatio = (volume / marketCap) * 100;
    
    // Liquidez Risk
    const liquidityRisk = volumeRatio < 5 ? 'high' : volumeRatio < 15 ? 'medium' : 'low';
    
    return [
      {
        name: 'Volatilidade Histórica',
        value: volatility,
        level: volatility > 10 ? 'high' : volatility > 5 ? 'medium' : 'low',
        description: `Medida da variação de preços nos últimos 30 dias`,
        unit: '%'
      },
      {
        name: 'Value at Risk (95%)',
        value: var95,
        level: var95 > 15 ? 'high' : var95 > 8 ? 'medium' : 'low',
        description: `5% de chance de perder mais que este valor em 24h`,
        unit: '%'
      },
      {
        name: 'Correlação com BTC',
        value: btcCorrelation * 100,
        level: btcCorrelation > 0.8 ? 'high' : btcCorrelation > 0.5 ? 'medium' : 'low',
        description: `Nível de correlação com o Bitcoin`,
        unit: '%'
      },
      {
        name: 'Drawdown Máximo',
        value: maxDrawdown,
        level: maxDrawdown > 20 ? 'high' : maxDrawdown > 10 ? 'medium' : 'low',
        description: `Maior queda desde o último pico`,
        unit: '%'
      },
      {
        name: 'Risco de Liquidez',
        value: volumeRatio,
        level: liquidityRisk as 'low' | 'medium' | 'high',
        description: `Facilidade para comprar/vender sem afetar o preço`,
        unit: '%'
      }
    ];
  };

  const getPositionSizing = (riskLevel: string) => {
    const suggestions = {
      'Conservador': {
        percentage: '1-2%',
        description: 'Para investidores que priorizam preservação de capital',
        color: 'text-blue-700 bg-blue-100'
      },
      'Moderado': {
        percentage: '3-5%',
        description: 'Para investidores com tolerância média ao risco',
        color: 'text-yellow-700 bg-yellow-100'
      },
      'Agressivo': {
        percentage: '5-10%',
        description: 'Para investidores experientes com alta tolerância ao risco',
        color: 'text-red-700 bg-red-100'
      }
    };

    return suggestions;
  };

  const calculateOverallRisk = (metrics: RiskMetric[]): { level: string; score: number; color: string } => {
    const highRiskCount = metrics.filter(m => m.level === 'high').length;
    const mediumRiskCount = metrics.filter(m => m.level === 'medium').length;
    
    const score = (highRiskCount * 3 + mediumRiskCount * 2) / metrics.length;
    
    if (score >= 2.5) return { level: 'Alto Risco', score: score * 33.33, color: 'text-red-700 bg-red-100' };
    if (score >= 1.5) return { level: 'Risco Moderado', score: score * 33.33, color: 'text-yellow-700 bg-yellow-100' };
    return { level: 'Baixo Risco', score: score * 33.33, color: 'text-green-700 bg-green-100' };
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-700 bg-red-100';
      case 'medium': return 'text-yellow-700 bg-yellow-100';
      default: return 'text-green-700 bg-green-100';
    }
  };

  const metrics = calculateRiskMetrics();
  const overallRisk = calculateOverallRisk(metrics);
  const positionSizing = getPositionSizing('moderate');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="w-5 h-5" />
          <span>Análise de Risco</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Risk Score */}
        <div className="p-4 rounded-lg border-2 border-primary/20">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">Nível de Risco Geral</h3>
            <Badge className={`${overallRisk.color} text-lg px-4 py-2`}>
              {overallRisk.level}
            </Badge>
            <Progress value={overallRisk.score} className="h-3 mt-2" />
          </div>
        </div>

        {/* Risk Metrics */}
        <div className="space-y-4">
          <h4 className="font-semibold">Métricas de Risco</h4>
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{metric.name}</span>
                  <Badge className={getRiskColor(metric.level)}>
                    {metric.value.toFixed(2)}{metric.unit}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{metric.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Position Sizing Suggestions */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center space-x-2">
            <TrendingDown className="w-4 h-4" />
            <span>Sugestões de Tamanho de Posição</span>
          </h4>
          {Object.entries(positionSizing).map(([profile, data]) => (
            <div key={profile} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <div className="font-medium">{profile}</div>
                <div className="text-sm text-muted-foreground">{data.description}</div>
              </div>
              <Badge className={data.color}>
                {data.percentage} do portfólio
              </Badge>
            </div>
          ))}
        </div>

        {/* Risk Warning */}
        <div className="flex items-start space-x-3 p-3 rounded-lg bg-orange-50 border border-orange-200">
          <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
          <div className="text-sm">
            <div className="font-medium text-orange-800">Aviso Importante</div>
            <div className="text-orange-700 mt-1">
              Esta análise é baseada em dados históricos e simulações. Criptomoedas são investimentos de alto risco. 
              Nunca invista mais do que pode perder e sempre faça sua própria pesquisa.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskAnalysis;
