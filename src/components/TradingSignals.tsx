
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";
import { CryptoData } from "@/context/CryptoContext";
import {
  analyzeCandlestickPattern,
  analyzeVolumeProfile,
  analyzeMomentum,
  analyzeSupportResistance,
  calculateOverallScore,
  TradingSignal
} from "@/utils/tradingSignals";

interface TradingSignalsProps {
  crypto: CryptoData;
}

const TradingSignals = ({ crypto }: TradingSignalsProps) => {
  const generateSignals = (): TradingSignal[] => {
    return [
      analyzeCandlestickPattern(crypto),
      analyzeVolumeProfile(crypto),
      analyzeMomentum(crypto),
      analyzeSupportResistance(crypto)
    ];
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

  const getSignalText = (signal: string) => {
    switch (signal) {
      case 'strong_buy': return 'Compra Forte';
      case 'buy': return 'Compra';
      case 'sell': return 'Venda';
      case 'strong_sell': return 'Venda Forte';
      default: return 'Neutro';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5" />
          <span>Sinais de Trading Aprimorados</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Análise técnica baseada em padrões reais de mercado e volume
        </p>
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
            <div className="text-sm text-muted-foreground">
              Confiança: {overall.confidence.toFixed(0)}%
            </div>
            <Progress value={overall.score * 10} className="h-3 mt-2" />
          </div>
        </div>

        {/* Individual Signals */}
        <div className="space-y-4">
          {signals.map((signal, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center space-x-3">
                {getSignalIcon(signal.signal)}
                <div className="flex-1">
                  <div className="font-medium">{signal.type}</div>
                  <div className="text-sm text-muted-foreground">{signal.description}</div>
                </div>
              </div>
              <div className="text-right space-y-1">
                <Badge className={getSignalColor(signal.signal)}>
                  {getSignalText(signal.signal)}
                </Badge>
                <div className="text-xs text-muted-foreground">
                  Força: {signal.strength}/10
                </div>
                <div className="text-xs text-muted-foreground">
                  Confiança: {signal.confidence}%
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-green-50 border border-green-200">
          <div className="text-sm text-green-800">
            <div className="font-semibold mb-1">✅ Análise Melhorada</div>
            <div>
              Os sinais agora são baseados em análise técnica real: padrões de candlestick, 
              perfil de volume, momentum e níveis de suporte/resistência calculados com dados precisos.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingSignals;
