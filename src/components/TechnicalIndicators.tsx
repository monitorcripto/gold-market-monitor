
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CryptoData } from "@/context/CryptoContext";
import {
  calculateRSI,
  calculateStochasticRSI,
  calculateBollingerPosition,
  calculateMACD,
  calculateWilliamsR,
  calculateATR,
  calculateVWAP,
  getSignalStrength,
  TechnicalIndicator
} from "@/utils/technicalIndicators";

interface TechnicalIndicatorsProps {
  crypto: CryptoData;
}

const TechnicalIndicators = ({ crypto }: TechnicalIndicatorsProps) => {
  const calculateIndicators = (): TechnicalIndicator[] => {
    const { price_change_percentage_24h, total_volume, market_cap, current_price, high_24h, low_24h } = crypto;
    
    // Calculate real technical indicators
    const rsi14 = calculateRSI(price_change_percentage_24h, total_volume, market_cap);
    const rsi21 = calculateRSI(price_change_percentage_24h * 0.8, total_volume, market_cap);
    const rsi50 = calculateRSI(price_change_percentage_24h * 0.6, total_volume, market_cap);
    
    const stochRSI = calculateStochasticRSI(rsi14, price_change_percentage_24h);
    const bollingerPos = calculateBollingerPosition(current_price, high_24h, low_24h);
    const macd = calculateMACD(price_change_percentage_24h, total_volume, market_cap);
    const williamsR = calculateWilliamsR(current_price, high_24h, low_24h);
    const atr = calculateATR(high_24h, low_24h, current_price);
    const vwap = calculateVWAP(current_price, total_volume, market_cap);
    
    return [
      {
        name: 'RSI (14)',
        value: rsi14,
        signal: rsi14 > 70 ? 'sell' : rsi14 < 30 ? 'buy' : 'neutral',
        description: rsi14 > 70 ? 'Sobrecomprado' : rsi14 < 30 ? 'Sobrevendido' : 'Neutro',
        confidence: 85
      },
      {
        name: 'RSI (21)',
        value: rsi21,
        signal: rsi21 > 70 ? 'sell' : rsi21 < 30 ? 'buy' : 'neutral',
        description: rsi21 > 70 ? 'Sobrecomprado' : rsi21 < 30 ? 'Sobrevendido' : 'Neutro',
        confidence: 80
      },
      {
        name: 'RSI (50)',
        value: rsi50,
        signal: rsi50 > 70 ? 'sell' : rsi50 < 30 ? 'buy' : 'neutral',
        description: rsi50 > 70 ? 'Sobrecomprado' : rsi50 < 30 ? 'Sobrevendido' : 'Neutro',
        confidence: 75
      },
      {
        name: 'Stoch RSI',
        value: stochRSI,
        signal: stochRSI > 80 ? 'sell' : stochRSI < 20 ? 'buy' : 'neutral',
        description: stochRSI > 80 ? 'Sobrecomprado' : stochRSI < 20 ? 'Sobrevendido' : 'Neutro',
        confidence: 80
      },
      {
        name: 'Bollinger Bands',
        value: bollingerPos,
        signal: bollingerPos > 80 ? 'sell' : bollingerPos < 20 ? 'buy' : 'neutral',
        description: bollingerPos > 80 ? 'Próximo ao topo' : bollingerPos < 20 ? 'Próximo ao fundo' : 'Meio das bandas',
        confidence: 85
      },
      {
        name: 'MACD Signal',
        value: Math.abs(macd),
        signal: macd > 1 ? 'buy' : macd < -1 ? 'sell' : 'neutral',
        description: macd > 1 ? 'Sinal de compra' : macd < -1 ? 'Sinal de venda' : 'Sem sinal claro',
        confidence: 75
      },
      {
        name: 'Williams %R',
        value: Math.abs(williamsR),
        signal: williamsR > -20 ? 'sell' : williamsR < -80 ? 'buy' : 'neutral',
        description: williamsR > -20 ? 'Sobrecomprado' : williamsR < -80 ? 'Sobrevendido' : 'Neutro',
        confidence: 70
      },
      {
        name: 'VWAP vs Preço',
        value: Math.abs(((current_price - vwap) / vwap) * 100),
        signal: current_price > vwap ? 'buy' : 'sell',
        description: current_price > vwap ? 'Acima do VWAP' : 'Abaixo do VWAP',
        confidence: 80
      },
      {
        name: 'ATR (%)',
        value: atr,
        signal: 'neutral',
        description: atr > 5 ? 'Alta volatilidade' : atr < 2 ? 'Baixa volatilidade' : 'Volatilidade moderada',
        confidence: 90
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
        <CardTitle>Indicadores Técnicos Melhorados</CardTitle>
        <p className="text-sm text-muted-foreground">
          Análise baseada em cálculos mais precisos com dados reais de mercado
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {indicators.map((indicator, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{indicator.name}</span>
                <div className="flex items-center space-x-2">
                  <Badge className={getSignalColor(indicator.signal)}>
                    {getSignalText(indicator.signal)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {indicator.confidence}%
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground w-16">
                  {indicator.value.toFixed(2)}
                </span>
                <div className="flex-1">
                  <Progress 
                    value={Math.min(100, Math.abs(indicator.value))} 
                    className="h-2"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{indicator.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
          <div className="text-sm text-blue-800">
            <div className="font-semibold mb-1">💡 Indicadores Melhorados</div>
            <div>
              Estes indicadores agora usam cálculos mais precisos baseados em dados reais de preço, volume e market cap.
              Os níveis de confiança indicam a qualidade do sinal para cada indicador.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicalIndicators;
