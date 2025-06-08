
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";
import { CryptoData } from "@/context/CryptoContext";

interface TradingSignalsProps {
  crypto: CryptoData;
}

interface TradingSignal {
  type: string;
  strength: number; // 1-10
  signal: 'strong_buy' | 'buy' | 'neutral' | 'sell' | 'strong_sell';
  description: string;
  confidence: number; // 0-100
}

const TradingSignals = ({ crypto }: TradingSignalsProps) => {
  const generateSignals = (): TradingSignal[] => {
    const priceChange = crypto.price_change_percentage_24h;
    const volume = crypto.total_volume;
    const marketCap = crypto.market_cap;
    
    const signals: TradingSignal[] = [
      {
        type: 'Padrão de Candlestick',
        strength: Math.abs(priceChange) > 5 ? 8 : 5,
        signal: priceChange > 5 ? 'buy' : priceChange < -5 ? 'sell' : 'neutral',
        description: priceChange > 5 ? 'Padrão de alta identificado' : priceChange < -5 ? 'Padrão de baixa identificado' : 'Sem padrão claro',
        confidence: Math.min(90, 50 + Math.abs(priceChange) * 5)
      },
      {
        type: 'Volume Analysis',
        strength: volume > marketCap * 0.1 ? 9 : 4,
        signal: volume > marketCap * 0.1 && priceChange > 0 ? 'buy' : volume > marketCap * 0.1 && priceChange < 0 ? 'sell' : 'neutral',
        description: volume > marketCap * 0.1 ? 'Volume anômalo detectado' : 'Volume normal',
        confidence: volume > marketCap * 0.1 ? 85 : 60
      },
      {
        type: 'Momentum Convergence',
        strength: 7,
        signal: priceChange > 2 ? 'buy' : priceChange < -2 ? 'sell' : 'neutral',
        description: priceChange > 2 ? 'Momentum positivo forte' : priceChange < -2 ? 'Momentum negativo forte' : 'Momentum neutro',
        confidence: 70
      },
      {
        type: 'Support/Resistance',
        strength: 6,
        signal: crypto.current_price > crypto.high_24h * 0.95 ? 'sell' : crypto.current_price < crypto.low_24h * 1.05 ? 'buy' : 'neutral',
        description: crypto.current_price > crypto.high_24h * 0.95 ? 'Próximo à resistência' : crypto.current_price < crypto.low_24h * 1.05 ? 'Próximo ao suporte' : 'Entre suporte e resistência',
        confidence: 75
      }
    ];

    return signals;
  };

  const calculateOverallScore = (signals: TradingSignal[]): { score: number; recommendation: string; color: string } => {
    let totalScore = 0;
    let weightSum = 0;

    signals.forEach(signal => {
      const weight = signal.confidence / 100;
      let signalScore = 0;
      
      switch (signal.signal) {
        case 'strong_buy': signalScore = 10; break;
        case 'buy': signalScore = 7; break;
        case 'neutral': signalScore = 5; break;
        case 'sell': signalScore = 3; break;
        case 'strong_sell': signalScore = 1; break;
      }
      
      totalScore += signalScore * weight;
      weightSum += weight;
    });

    const finalScore = totalScore / weightSum;
    
    let recommendation = '';
    let color = '';
    
    if (finalScore >= 8) {
      recommendation = 'COMPRA FORTE';
      color = 'text-green-700 bg-green-100';
    } else if (finalScore >= 6) {
      recommendation = 'COMPRA';
      color = 'text-green-600 bg-green-50';
    } else if (finalScore >= 4) {
      recommendation = 'NEUTRO';
      color = 'text-gray-600 bg-gray-100';
    } else if (finalScore >= 2) {
      recommendation = 'VENDA';
      color = 'text-red-600 bg-red-50';
    } else {
      recommendation = 'VENDA FORTE';
      color = 'text-red-700 bg-red-100';
    }

    return { score: finalScore, recommendation, color };
  };

  const signals = generateSignals();
  const overall = calculateOverallScore(signals);

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'strong_buy':
      case 'buy':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'strong_sell':
      case 'sell':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'strong_buy': return 'bg-green-200 text-green-800';
      case 'buy': return 'bg-green-100 text-green-700';
      case 'sell': return 'bg-red-100 text-red-700';
      case 'strong_sell': return 'bg-red-200 text-red-800';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5" />
          <span>Sinais de Trading</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Overall Score */}
        <div className="mb-6 p-4 rounded-lg border-2 border-primary/20">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">Score Geral de Trading</h3>
            <div className="text-3xl font-bold">{overall.score.toFixed(1)}/10</div>
            <Badge className={`${overall.color} text-lg px-4 py-2`}>
              {overall.recommendation}
            </Badge>
            <Progress value={overall.score * 10} className="h-3 mt-2" />
          </div>
        </div>

        {/* Individual Signals */}
        <div className="space-y-4">
          {signals.map((signal, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center space-x-3">
                {getSignalIcon(signal.signal)}
                <div>
                  <div className="font-medium">{signal.type}</div>
                  <div className="text-sm text-muted-foreground">{signal.description}</div>
                </div>
              </div>
              <div className="text-right space-y-1">
                <Badge className={getSignalColor(signal.signal)}>
                  Força: {signal.strength}/10
                </Badge>
                <div className="text-xs text-muted-foreground">
                  Confiança: {signal.confidence}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingSignals;
