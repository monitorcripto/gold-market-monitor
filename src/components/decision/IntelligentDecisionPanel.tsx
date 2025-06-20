
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, TrendingUp, Shield, Clock, DollarSign, BarChart3, AlertCircle } from "lucide-react";
import { CryptoData } from "@/context/CryptoContext";
import { Decision, generateIntelligentDecisionPanel } from "@/utils/decisionUtils";

interface IntelligentDecisionPanelProps {
  crypto: CryptoData;
  decision: Decision;
}

const IntelligentDecisionPanel = ({ crypto, decision }: IntelligentDecisionPanelProps) => {
  const intelligentPanel = generateIntelligentDecisionPanel(crypto, decision);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'text-red-700 bg-red-100';
      case 'medium': return 'text-yellow-700 bg-yellow-100';
      default: return 'text-green-700 bg-green-100';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'strong_buy': return 'text-green-800 bg-green-200';
      case 'buy': return 'text-green-700 bg-green-100';
      case 'sell': return 'text-red-700 bg-red-100';
      case 'strong_sell': return 'text-red-800 bg-red-200';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="w-6 h-6 text-primary" />
          <span>Painel de Decisão Inteligente</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Análise aprofundada e recomendações personalizadas para {crypto.name}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recomendação Principal */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20">
          <div className="flex items-start space-x-3">
            <Target className="w-5 h-5 text-primary mt-1" />
            <div className="flex-1">
              <h4 className="font-semibold text-primary mb-2">Recomendação Principal</h4>
              <p className="text-sm">{intelligentPanel.primaryRecommendation}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge className={getActionColor(decision.action)}>
                  {decision.action.replace('_', ' ').toUpperCase()}
                </Badge>
                <Badge className={getRiskColor(decision.riskLevel)}>
                  Risco {decision.riskLevel.toUpperCase()}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Retorno esperado: {decision.expectedReturn > 0 ? '+' : ''}{decision.expectedReturn}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de Informações */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Contexto de Mercado */}
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h5 className="font-medium">Contexto de Mercado</h5>
            </div>
            <p className="text-sm text-muted-foreground">{intelligentPanel.marketContext}</p>
          </div>

          {/* Avaliação de Risco */}
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-4 h-4 text-orange-600" />
              <h5 className="font-medium">Avaliação de Risco</h5>
            </div>
            <p className="text-sm text-muted-foreground">{intelligentPanel.riskAssessment}</p>
          </div>

          {/* Horizonte Temporal */}
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <h5 className="font-medium">Horizonte Temporal</h5>
            </div>
            <p className="text-sm text-muted-foreground">{intelligentPanel.timeHorizon}</p>
          </div>

          {/* Alocação de Portfólio */}
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <h5 className="font-medium">Alocação Sugerida</h5>
            </div>
            <p className="text-sm text-muted-foreground">{intelligentPanel.portfolioAllocation}</p>
          </div>
        </div>

        {/* Estratégias de Entrada e Saída */}
        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-green-200 bg-green-50">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <h5 className="font-medium text-green-800">Estratégia de Entrada</h5>
            </div>
            <p className="text-sm text-green-700">{intelligentPanel.entryStrategy}</p>
          </div>

          <div className="p-4 rounded-lg border border-blue-200 bg-blue-50">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-4 h-4 text-blue-600" />
              <h5 className="font-medium text-blue-800">Estratégia de Saída</h5>
            </div>
            <p className="text-sm text-blue-700">{intelligentPanel.exitStrategy}</p>
          </div>
        </div>

        {/* Opções Alternativas */}
        <div className="space-y-3">
          <h5 className="font-medium flex items-center space-x-2">
            <AlertCircle className="w-4 h-4" />
            <span>Opções Alternativas</span>
          </h5>
          <div className="space-y-2">
            {intelligentPanel.alternativeOptions.map((option, index) => (
              <div key={index} className="flex items-start space-x-2 p-2 rounded bg-muted/30">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-sm">{option}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Níveis Técnicos */}
        <div className="p-4 rounded-lg bg-gray-50 border">
          <h5 className="font-medium mb-3">Níveis Técnicos Importantes</h5>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xs text-muted-foreground">Stop Loss</div>
              <div className="text-sm font-medium text-red-600">
                ${decision.stopLoss.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Preço Atual</div>
              <div className="text-sm font-medium">
                ${crypto.current_price.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Target Price</div>
              <div className="text-sm font-medium text-green-600">
                ${decision.targetPrice.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntelligentDecisionPanel;
