
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  HelpCircle,
  Target,
  Clock,
  DollarSign
} from "lucide-react";
import { CryptoData } from "@/context/CryptoContext";
import { Decision } from "@/utils/decisionUtils";

interface SimplifiedDecisionGuideProps {
  crypto: CryptoData;
  decision: Decision;
}

interface SimpleRecommendation {
  action: "BUY" | "SELL" | "WAIT";
  confidence: "Alta" | "Média" | "Baixa";
  reason: string;
  simpleExplanation: string;
  whatToDo: string;
  riskLevel: "Baixo" | "Moderado" | "Alto";
  timeframe: string;
  color: string;
  icon: JSX.Element;
}

const SimplifiedDecisionGuide = ({ crypto, decision }: SimplifiedDecisionGuideProps) => {
  
  const generateSimpleRecommendation = (): SimpleRecommendation => {
    const { action, confidence, score } = decision;
    
    if (action === 'strong_buy' || action === 'buy') {
      return {
        action: "BUY",
        confidence: confidence > 80 ? "Alta" : confidence > 60 ? "Média" : "Baixa",
        reason: score > 75 ? 
          "Múltiplos indicadores mostram momento favorável para compra" :
          "Indicadores sugerem oportunidade de entrada",
        simpleExplanation: score > 75 ?
          "O preço está em uma boa posição para subir. É um bom momento para investir." :
          "Há sinais de que o preço pode subir, mas com menos certeza.",
        whatToDo: score > 75 ?
          "Considere comprar uma quantidade que você se sinta confortável em investir" :
          "Se decidir comprar, comece com uma quantia pequena",
        riskLevel: decision.riskLevel === 'high' ? "Alto" : decision.riskLevel === 'medium' ? "Moderado" : "Baixo",
        timeframe: "Próximos 3-7 dias",
        color: "text-green-700 bg-green-100 border-green-300",
        icon: <TrendingUp className="w-6 h-6 text-green-600" />
      };
    } else if (action === 'strong_sell' || action === 'sell') {
      return {
        action: "SELL",
        confidence: confidence > 80 ? "Alta" : confidence > 60 ? "Média" : "Baixa",
        reason: "Indicadores sugerem que o preço pode cair",
        simpleExplanation: "Os sinais mostram que o preço provavelmente vai diminuir. É melhor vender agora.",
        whatToDo: action === 'strong_sell' ?
          "Considere vender para evitar perdas maiores" :
          "Pense em vender pelo menos parte do que você tem",
        riskLevel: "Alto",
        timeframe: "Próximos 1-3 dias",
        color: "text-red-700 bg-red-100 border-red-300",
        icon: <TrendingDown className="w-6 h-6 text-red-600" />
      };
    } else {
      return {
        action: "WAIT",
        confidence: "Média",
        reason: "Sinais mistos - melhor aguardar uma definição",
        simpleExplanation: "Não há uma direção clara agora. É melhor esperar para ver o que acontece.",
        whatToDo: "Aguarde alguns dias antes de tomar qualquer decisão",
        riskLevel: "Moderado",
        timeframe: "Aguardar 3-7 dias",
        color: "text-yellow-700 bg-yellow-100 border-yellow-300",
        icon: <Clock className="w-6 h-6 text-yellow-600" />
      };
    }
  };

  const recommendation = generateSimpleRecommendation();

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Alto": return "text-red-700 bg-red-100";
      case "Moderado": return "text-yellow-700 bg-yellow-100";
      default: return "text-green-700 bg-green-100";
    }
  };

  return (
    <div className="space-y-6">
      {/* Recomendação Principal Simplificada */}
      <Card className={`border-2 ${recommendation.color.split(' ')[2]}`}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            {recommendation.icon}
            <div>
              <div className="text-2xl font-bold">{recommendation.action}</div>
              <div className="text-sm font-normal text-muted-foreground">
                Recomendação para {crypto.name}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`p-4 rounded-lg ${recommendation.color}`}>
            <div className="font-semibold mb-2">O que isso significa?</div>
            <p className="text-sm mb-3">{recommendation.simpleExplanation}</p>
            <div className="font-semibold mb-2">O que você deve fazer?</div>
            <p className="text-sm">{recommendation.whatToDo}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded bg-muted/50">
              <div className="text-sm text-muted-foreground">Confiança</div>
              <div className="font-bold">{recommendation.confidence}</div>
            </div>
            <div className="text-center p-3 rounded bg-muted/50">
              <div className="text-sm text-muted-foreground">Prazo</div>
              <div className="font-bold text-xs">{recommendation.timeframe}</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Nível de Risco:</span>
            <Badge className={getRiskColor(recommendation.riskLevel)}>
              {recommendation.riskLevel}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Informações Importantes em Linguagem Simples */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5" />
            <span>Informações Importantes</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 rounded-lg bg-blue-50">
              <DollarSign className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium text-blue-800">Preço Atual</div>
                <div className="text-sm text-blue-700">
                  ${crypto.current_price.toFixed(2)} - 
                  {crypto.price_change_percentage_24h > 0 ? " Subiu " : " Caiu "}
                  {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}% hoje
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-lg bg-purple-50">
              <Target className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <div className="font-medium text-purple-800">Pontos de Referência</div>
                <div className="text-sm text-purple-700">
                  Se comprar, considere vender em ${decision.targetPrice.toFixed(2)}
                  <br />
                  Se o preço cair para ${decision.stopLoss.toFixed(2)}, considere vender para evitar mais perdas
                </div>
              </div>
            </div>

            {crypto.market_cap_rank <= 50 && (
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-green-50">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-medium text-green-800">Criptomoeda Estabelecida</div>
                  <div className="text-sm text-green-700">
                    Esta é uma das top {crypto.market_cap_rank} criptomoedas, considerada mais estável
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dicas para Iniciantes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span>Dicas Importantes para Você</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
              <span>Nunca invista mais do que você pode perder</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
              <span>Comece sempre com valores pequenos até ganhar experiência</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
              <span>Defina sempre um limite de perda antes de comprar</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
              <span>Não tome decisões baseadas em emoções - siga o plano</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
              <span>Esta é apenas uma sugestão, a decisão final é sempre sua</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimplifiedDecisionGuide;
