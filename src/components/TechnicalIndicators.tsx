
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CryptoData } from "@/context/CryptoContext";

interface TechnicalIndicatorsProps {
  crypto: CryptoData;
}

interface Indicator {
  name: string;
  value: number;
  signal: 'buy' | 'sell' | 'neutral';
  description: string;
}

const TechnicalIndicators = ({ crypto }: TechnicalIndicatorsProps) => {
  // Simulate advanced technical indicators based on price data
  const calculateIndicators = (): Indicator[] => {
    const priceChange = crypto.price_change_percentage_24h;
    const volume = crypto.total_volume;
    const marketCap = crypto.market_cap;
    
    // RSI (14, 21, 50 periods)
    const rsi14 = Math.max(0, Math.min(100, 50 + (priceChange * 2.5)));
    const rsi21 = Math.max(0, Math.min(100, 50 + (priceChange * 2.2)));
    const rsi50 = Math.max(0, Math.min(100, 50 + (priceChange * 1.8)));
    
    // Moving Averages simulation
    const sma20 = crypto.current_price * (1 + (Math.random() - 0.5) * 0.02);
    const sma50 = crypto.current_price * (1 + (Math.random() - 0.5) * 0.05);
    const sma200 = crypto.current_price * (1 + (Math.random() - 0.5) * 0.15);
    
    // Bollinger Bands
    const bbUpper = crypto.current_price * 1.05;
    const bbLower = crypto.current_price * 0.95;
    const bbPosition = ((crypto.current_price - bbLower) / (bbUpper - bbLower)) * 100;
    
    // Stochastic RSI
    const stochRSI = Math.max(0, Math.min(100, rsi14 + (Math.random() - 0.5) * 20));
    
    // Williams %R
    const williamsR = Math.max(-100, Math.min(0, -50 + (priceChange * 1.5)));
    
    // VWAP simulation
    const vwap = crypto.current_price * (1 + (volume / marketCap) * 0.1);
    
    // ATR (Average True Range)
    const atr = (crypto.high_24h - crypto.low_24h) / crypto.current_price * 100;

    return [
      {
        name: 'RSI (14)',
        value: rsi14,
        signal: rsi14 > 70 ? 'sell' : rsi14 < 30 ? 'buy' : 'neutral',
        description: rsi14 > 70 ? 'Sobrecomprado' : rsi14 < 30 ? 'Sobrevendido' : 'Neutro'
      },
      {
        name: 'RSI (21)',
        value: rsi21,
        signal: rsi21 > 70 ? 'sell' : rsi21 < 30 ? 'buy' : 'neutral',
        description: rsi21 > 70 ? 'Sobrecomprado' : rsi21 < 30 ? 'Sobrevendido' : 'Neutro'
      },
      {
        name: 'RSI (50)',
        value: rsi50,
        signal: rsi50 > 70 ? 'sell' : rsi50 < 30 ? 'buy' : 'neutral',
        description: rsi50 > 70 ? 'Sobrecomprado' : rsi50 < 30 ? 'Sobrevendido' : 'Neutro'
      },
      {
        name: 'Stoch RSI',
        value: stochRSI,
        signal: stochRSI > 80 ? 'sell' : stochRSI < 20 ? 'buy' : 'neutral',
        description: stochRSI > 80 ? 'Sobrecomprado' : stochRSI < 20 ? 'Sobrevendido' : 'Neutro'
      },
      {
        name: 'Williams %R',
        value: Math.abs(williamsR),
        signal: williamsR > -20 ? 'sell' : williamsR < -80 ? 'buy' : 'neutral',
        description: williamsR > -20 ? 'Sobrecomprado' : williamsR < -80 ? 'Sobrevendido' : 'Neutro'
      },
      {
        name: 'Bollinger Bands',
        value: bbPosition,
        signal: bbPosition > 80 ? 'sell' : bbPosition < 20 ? 'buy' : 'neutral',
        description: bbPosition > 80 ? 'Próximo ao topo' : bbPosition < 20 ? 'Próximo ao fundo' : 'Meio das bandas'
      },
      {
        name: 'SMA 20 vs Preço',
        value: ((crypto.current_price - sma20) / sma20) * 100,
        signal: crypto.current_price > sma20 ? 'buy' : 'sell',
        description: crypto.current_price > sma20 ? 'Acima da média' : 'Abaixo da média'
      },
      {
        name: 'VWAP',
        value: ((crypto.current_price - vwap) / vwap) * 100,
        signal: crypto.current_price > vwap ? 'buy' : 'sell',
        description: crypto.current_price > vwap ? 'Acima do VWAP' : 'Abaixo do VWAP'
      },
      {
        name: 'ATR (%)',
        value: atr,
        signal: atr > 5 ? 'neutral' : atr < 2 ? 'neutral' : 'neutral',
        description: atr > 5 ? 'Alta volatilidade' : 'Baixa volatilidade'
      }
    ];
  };

  const indicators = calculateIndicators();

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'buy': return 'bg-green-100 text-green-700';
      case 'sell': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getSignalText = (signal: string) => {
    switch (signal) {
      case 'buy': return 'Compra';
      case 'sell': return 'Venda';
      default: return 'Neutro';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Indicadores Técnicos Avançados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {indicators.map((indicator, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{indicator.name}</span>
                <Badge className={getSignalColor(indicator.signal)}>
                  {getSignalText(indicator.signal)}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground w-16">
                  {indicator.value.toFixed(2)}
                </span>
                <div className="flex-1">
                  <Progress 
                    value={Math.abs(indicator.value)} 
                    className="h-2"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{indicator.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicalIndicators;
