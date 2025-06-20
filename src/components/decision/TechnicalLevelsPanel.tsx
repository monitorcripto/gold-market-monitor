
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Target, Shield, ArrowUp, ArrowDown } from "lucide-react";
import { CryptoData } from "@/context/CryptoContext";
import { calculateTechnicalLevels } from "@/utils/technicalLevels";

interface TechnicalLevelsPanelProps {
  crypto: CryptoData;
}

const TechnicalLevelsPanel = ({ crypto }: TechnicalLevelsPanelProps) => {
  const levels = calculateTechnicalLevels(crypto);
  
  const getPricePosition = () => {
    const range = levels.resistance - levels.support;
    const position = ((levels.currentPrice - levels.support) / range) * 100;
    return Math.max(0, Math.min(100, position));
  };

  const getProjectionColor = (type: string) => {
    switch (type) {
      case 'bullish': return 'text-green-700 bg-green-100';
      case 'bearish': return 'text-red-700 bg-red-100';
      default: return 'text-blue-700 bg-blue-100';
    }
  };

  const pricePosition = getPricePosition();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="w-5 h-5" />
          <span>Níveis Técnicos e Projeções</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Análise de suporte, resistência e projeções de preço para {crypto.name}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Níveis Atuais */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-red-50 border border-red-200">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Shield className="w-4 h-4 text-red-600" />
              <span className="text-xs font-medium text-red-600">Suporte</span>
            </div>
            <div className="text-lg font-bold text-red-700">${levels.support}</div>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-gray-50 border border-gray-200">
            <div className="text-xs font-medium text-gray-600 mb-1">Preço Atual</div>
            <div className="text-lg font-bold text-gray-800">${levels.currentPrice}</div>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-green-50 border border-green-200">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Target className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-green-600">Resistência</span>
            </div>
            <div className="text-lg font-bold text-green-700">${levels.resistance}</div>
          </div>
        </div>

        {/* Visualização da Posição do Preço */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-red-600">Suporte</span>
            <span className="text-green-600">Resistência</span>
          </div>
          <div className="relative">
            <Progress value={pricePosition} className="h-3" />
            <div 
              className="absolute top-0 w-1 h-3 bg-gray-800 rounded"
              style={{ left: `${pricePosition}%`, transform: 'translateX(-50%)' }}
            />
          </div>
          <div className="text-center text-xs text-muted-foreground">
            Posição atual: {pricePosition.toFixed(1)}% do range suporte-resistência
          </div>
        </div>

        {/* Projeções de Preço */}
        <div className="space-y-3">
          <h5 className="font-medium">Projeções de Preço ({levels.projection.timeframe})</h5>
          
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-center space-x-2">
                <ArrowUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">Cenário Bullish</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-green-700">${levels.projection.bullish}</div>
                <div className="text-xs text-green-600">
                  +{(((levels.projection.bullish - levels.currentPrice) / levels.currentPrice) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Cenário Neutral</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-blue-700">${levels.projection.neutral}</div>
                <div className="text-xs text-blue-600">
                  {((levels.projection.neutral - levels.currentPrice) / levels.currentPrice * 100).toFixed(1)}%
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-200">
              <div className="flex items-center space-x-2">
                <ArrowDown className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium">Cenário Bearish</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-red-700">${levels.projection.bearish}</div>
                <div className="text-xs text-red-600">
                  {(((levels.projection.bearish - levels.currentPrice) / levels.currentPrice) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confiança da Análise */}
        <div className="p-3 rounded-lg bg-muted/50 border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Confiança da Análise</span>
            <Badge variant="outline">{levels.confidence}%</Badge>
          </div>
          <Progress value={levels.confidence} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            Baseado em volume de negociação, volatilidade e padrões técnicos históricos
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicalLevelsPanel;
