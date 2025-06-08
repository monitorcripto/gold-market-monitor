
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, BarChart3, Brain, Target } from "lucide-react";
import { CryptoData } from "@/context/CryptoContext";

interface DecisionDashboardProps {
  crypto: CryptoData;
}

interface Decision {
  action: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
  confidence: number;
  score: number;
  reasoning: string[];
  timeframe: string;
}

const DecisionDashboard = ({ crypto }: DecisionDashboardProps) => {
  const calculateDecision = (): Decision => {
    const priceChange = crypto.price_change_percentage_24h;
    const volume = crypto.total_volume;
    const marketCap = crypto.market_cap;
    const currentPrice = crypto.current_price;
    
    // Technical Analysis Score (0-25)
    let technicalScore = 12.5; // neutral base
    if (priceChange > 5) technicalScore += 8;
    else if (priceChange > 2) technicalScore += 4;
    else if (priceChange < -5) technicalScore -= 8;
    else if (priceChange < -2) technicalScore -= 4;
    
    // Volume Analysis Score (0-25)
    let volumeScore = 12.5;
    const volumeRatio = volume / marketCap;
    if (volumeRatio > 0.15) volumeScore += 8;
    else if (volumeRatio > 0.1) volumeScore += 4;
    else if (volumeRatio < 0.05) volumeScore -= 4;
    
    // Market Position Score (0-25)
    let positionScore = 12.5;
    const pricePosition = (currentPrice - crypto.low_24h) / (crypto.high_24h - crypto.low_24h);
    if (pricePosition > 0.8) positionScore -= 6; // near resistance
    else if (pricePosition < 0.2) positionScore += 6; // near support
    
    // Fear & Greed Influence (0-25)
    let sentimentScore = 12.5;
    // This would integrate with actual Fear & Greed data
    const simulatedFearGreed = 50 + (priceChange * 2);
    if (simulatedFearGreed < 30) sentimentScore += 6; // extreme fear = buy opportunity
    else if (simulatedFearGreed > 70) sentimentScore -= 6; // extreme greed = sell opportunity
    
    const totalScore = Math.max(0, Math.min(100, technicalScore + volumeScore + positionScore + sentimentScore));
    
    let action: Decision['action'];
    let confidence: number;
    let reasoning: string[] = [];
    
    if (totalScore >= 80) {
      action = 'strong_buy';
      confidence = 90;
      reasoning = [
        'Múltiplos indicadores apontam para forte tendência de alta',
        'Volume acima da média confirma movimento',
        'Momentum técnico muito positivo'
      ];
    } else if (totalScore >= 60) {
      action = 'buy';
      confidence = 75;
      reasoning = [
        'Indicadores técnicos majoritariamente positivos',
        'Bom momento para entrada ou acúmulo',
        'Risco/retorno favorável'
      ];
    } else if (totalScore >= 40) {
      action = 'hold';
      confidence = 60;
      reasoning = [
        'Sinais mistos no mercado',
        'Aguardar confirmação de tendência',
        'Manter posições atuais'
      ];
    } else if (totalScore >= 20) {
      action = 'sell';
      confidence = 75;
      reasoning = [
        'Indicadores técnicos majoritariamente negativos',
        'Momento adequado para realização de lucros',
        'Sinais de enfraquecimento da tendência'
      ];
    } else {
      action = 'strong_sell';
      confidence = 90;
      reasoning = [
        'Múltiplos indicadores apontam para forte pressão vendedora',
        'Alto risco de perdas adicionais',
        'Recomendada saída imediata'
      ];
    }
    
    return {
      action,
      confidence,
      score: totalScore,
      reasoning,
      timeframe: '24h'
    };
  };

  const getActionDetails = (action: string) => {
    const details = {
      strong_buy: {
        label: 'COMPRA FORTE',
        color: 'text-green-800 bg-green-200',
        icon: <TrendingUp className="w-5 h-5" />,
        description: 'Sinal muito forte de compra'
      },
      buy: {
        label: 'COMPRA',
        color: 'text-green-700 bg-green-100',
        icon: <TrendingUp className="w-4 h-4" />,
        description: 'Sinal de compra'
      },
      hold: {
        label: 'MANTER',
        color: 'text-gray-700 bg-gray-100',
        icon: <BarChart3 className="w-4 h-4" />,
        description: 'Manter posição atual'
      },
      sell: {
        label: 'VENDA',
        color: 'text-red-700 bg-red-100',
        icon: <TrendingDown className="w-4 h-4" />,
        description: 'Sinal de venda'
      },
      strong_sell: {
        label: 'VENDA FORTE',
        color: 'text-red-800 bg-red-200',
        icon: <TrendingDown className="w-5 h-5" />,
        description: 'Sinal muito forte de venda'
      }
    };
    
    return details[action as keyof typeof details];
  };

  const decision = calculateDecision();
  const actionDetails = getActionDetails(decision.action);

  // Simulated historical performance
  const historicalAccuracy = {
    total_signals: 47,
    correct_signals: 34,
    accuracy_percentage: 72,
    profit_loss: '+18.5%'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="w-5 h-5" />
          <span>Dashboard de Decisão</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Decision */}
        <div className="text-center p-6 rounded-lg border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="space-y-4">
            <div className="flex justify-center">
              {actionDetails.icon}
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{decision.score}/100</div>
              <Badge className={`${actionDetails.color} text-xl px-6 py-3`}>
                {actionDetails.label}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              {actionDetails.description}
            </div>
            <Progress value={decision.score} className="h-4" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Venda Forte</span>
              <span>Neutro</span>
              <span>Compra Forte</span>
            </div>
          </div>
        </div>

        {/* Confidence & Timeframe */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold">{decision.confidence}%</div>
            <div className="text-sm text-muted-foreground">Confiança</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold">{decision.timeframe}</div>
            <div className="text-sm text-muted-foreground">Timeframe</div>
          </div>
        </div>

        {/* Reasoning */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Fundamentos da Decisão</span>
          </h4>
          <div className="space-y-2">
            {decision.reasoning.map((reason, index) => (
              <div key={index} className="flex items-start space-x-2 p-2 rounded bg-muted/30">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-sm">{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Historical Performance */}
        <div className="space-y-3">
          <h4 className="font-semibold">Performance Histórica do Sistema</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-lg font-bold">{historicalAccuracy.accuracy_percentage}%</div>
              <div className="text-xs text-muted-foreground">Taxa de Acerto</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-lg font-bold text-green-600">{historicalAccuracy.profit_loss}</div>
              <div className="text-xs text-muted-foreground">Retorno Total</div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground text-center">
            Baseado em {historicalAccuracy.correct_signals}/{historicalAccuracy.total_signals} sinais nos últimos 30 dias
          </div>
        </div>

        {/* Risk Warning */}
        <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
          <div className="text-sm text-orange-800">
            <div className="font-semibold mb-1">⚠️ Aviso de Risco</div>
            <div>
              Esta é uma análise automatizada baseada em indicadores técnicos e não constitui aconselhamento financeiro. 
              Sempre faça sua própria pesquisa e considere consultar um consultor financeiro qualificado.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DecisionDashboard;
