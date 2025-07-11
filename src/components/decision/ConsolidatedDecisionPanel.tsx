
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, XCircle, Scale } from "lucide-react";
import { CryptoData } from "@/context/CryptoContext";
import { Decision } from "@/utils/decisionUtils";
import { 
  analyzeCandlestickPattern,
  analyzeVolumeProfile,
  analyzeMomentum,
  analyzeSupportResistance,
  calculateOverallScore
} from "@/utils/tradingSignals";

interface ConsolidatedDecisionPanelProps {
  crypto: CryptoData;
  decision: Decision;
}

interface ConsolidatedAnalysis {
  technicalScore: number;
  fundamentalScore: number;
  finalScore: number;
  finalRecommendation: string;
  confidence: number;
  consensusPoints: string[];
  divergencePoints: string[];
  explanation: string;
}

const ConsolidatedDecisionPanel = ({ crypto, decision }: ConsolidatedDecisionPanelProps) => {
  const generateConsolidatedAnalysis = (): ConsolidatedAnalysis => {
    // Análise Técnica (baseada nos trading signals)
    const technicalSignals = [
      analyzeCandlestickPattern(crypto),
      analyzeVolumeProfile(crypto),
      analyzeMomentum(crypto),
      analyzeSupportResistance(crypto)
    ];
    const technicalOverall = calculateOverallScore(technicalSignals);
    const technicalScore = technicalOverall.score;

    // Análise Fundamental (baseada no decision score)
    const fundamentalScore = decision.score;

    // Score Final Ponderado (60% técnico, 40% fundamental para trading)
    const finalScore = (technicalScore * 0.6) + (fundamentalScore * 0.4);

    // Determinar recomendação final
    let finalRecommendation = '';
    let confidence = 0;

    if (finalScore >= 8) {
      finalRecommendation = 'COMPRA FORTE';
      confidence = 90;
    } else if (finalScore >= 6.5) {
      finalRecommendation = 'COMPRA';
      confidence = 75;
    } else if (finalScore >= 3.5) {
      finalRecommendation = 'NEUTRO/AGUARDAR';
      confidence = 60;
    } else if (finalScore >= 2) {
      finalRecommendation = 'VENDA';
      confidence = 75;
    } else {
      finalRecommendation = 'VENDA FORTE';
      confidence = 90;
    }

    // Identificar pontos de consenso e divergência
    const consensusPoints: string[] = [];
    const divergencePoints: string[] = [];

    const technicalBullish = technicalScore > 6;
    const fundamentalBullish = fundamentalScore > 60;
    const technicalBearish = technicalScore < 4;
    const fundamentalBearish = fundamentalScore < 40;

    // Consenso
    if (technicalBullish && fundamentalBullish) {
      consensusPoints.push('Ambas análises indicam oportunidade de compra');
    }
    if (technicalBearish && fundamentalBearish) {
      consensusPoints.push('Ambas análises sugerem cautela ou venda');
    }
    if (crypto.price_change_percentage_24h > 0 && crypto.market_cap_rank <= 50) {
      consensusPoints.push('Momentum positivo em ativo estabelecido');
    }
    if (crypto.total_volume / crypto.market_cap > 0.1) {
      consensusPoints.push('Volume de negociação saudável');
    }

    // Divergências
    if (technicalBullish && !fundamentalBullish) {
      divergencePoints.push('Sinais técnicos positivos, mas fundamentos neutros/negativos');
    }
    if (!technicalBullish && fundamentalBullish) {
      divergencePoints.push('Fundamentos sólidos, mas sinais técnicos fracos');
    }
    if (Math.abs(technicalScore - (fundamentalScore / 10)) > 2) {
      divergencePoints.push('Grande diferença entre análise técnica e fundamental');
    }

    // Explicação contextual
    let explanation = '';
    if (divergencePoints.length > 0) {
      explanation = 'A divergência sugere um momento de transição no mercado. ';
      if (technicalScore > fundamentalScore / 10) {
        explanation += 'Os sinais técnicos indicam oportunidade de curto prazo, mas considere os fundamentos para decisões de longo prazo.';
      } else {
        explanation += 'Os fundamentos são sólidos, mas o timing técnico pode não ser ideal. Considere aguardar melhor ponto de entrada.';
      }
    } else {
      explanation = 'Há consenso entre as análises, aumentando a confiança na recomendação.';
    }

    return {
      technicalScore,
      fundamentalScore,
      finalScore,
      finalRecommendation,
      confidence,
      consensusPoints,
      divergencePoints,
      explanation
    };
  };

  const analysis = generateConsolidatedAnalysis();

  const getRecommendationColor = (recommendation: string) => {
    if (recommendation.includes('COMPRA FORTE')) return 'bg-green-200 text-green-800 border-green-300';
    if (recommendation.includes('COMPRA')) return 'bg-green-100 text-green-700 border-green-200';
    if (recommendation.includes('VENDA FORTE')) return 'bg-red-200 text-red-800 border-red-300';
    if (recommendation.includes('VENDA')) return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  };

  const getScoreColor = (score: number) => {
    if (score >= 7) return 'text-green-600';
    if (score >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="border-2 border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Scale className="w-6 h-6 text-primary" />
          <span>Painel Consolidador de Decisão</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Análise unificada combinando sinais técnicos e fundamentos para {crypto.name}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recomendação Final */}
        <div className={`p-4 rounded-lg border-2 ${getRecommendationColor(analysis.finalRecommendation)}`}>
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold">{analysis.finalRecommendation}</div>
            <div className="text-sm">Score Final: {analysis.finalScore.toFixed(1)}/10</div>
            <div className="text-xs">Confiança: {analysis.confidence}%</div>
            <Progress value={analysis.finalScore * 10} className="h-2 mt-2" />
          </div>
        </div>

        {/* Breakdown das Análises */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center space-x-1">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Análise Técnica</span>
              </div>
              <div className={`text-xl font-bold ${getScoreColor(analysis.technicalScore)}`}>
                {analysis.technicalScore.toFixed(1)}/10
              </div>
              <div className="text-xs text-blue-600">Peso: 60%</div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center space-x-1">
                <Brain className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Análise Fundamental</span>
              </div>
              <div className={`text-xl font-bold ${getScoreColor(analysis.fundamentalScore / 10)}`}>
                {(analysis.fundamentalScore / 10).toFixed(1)}/10
              </div>
              <div className="text-xs text-purple-600">Peso: 40%</div>
            </div>
          </div>
        </div>

        {/* Explicação Contextual */}
        <div className="p-4 rounded-lg bg-gray-50 border">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-5 h-5 text-gray-600 mt-0.5" />
            <div>
              <h5 className="font-medium text-gray-800 mb-1">Interpretação da Análise</h5>
              <p className="text-sm text-gray-600">{analysis.explanation}</p>
            </div>
          </div>
        </div>

        {/* Pontos de Consenso */}
        {analysis.consensusPoints.length > 0 && (
          <div className="space-y-2">
            <h5 className="font-medium text-green-800 flex items-center space-x-1">
              <CheckCircle className="w-4 h-4" />
              <span>Pontos de Consenso</span>
            </h5>
            <div className="space-y-1">
              {analysis.consensusPoints.map((point, index) => (
                <div key={index} className="flex items-start space-x-2 p-2 rounded bg-green-50">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                  <span className="text-sm text-green-700">{point}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pontos de Divergência */}
        {analysis.divergencePoints.length > 0 && (
          <div className="space-y-2">
            <h5 className="font-medium text-orange-800 flex items-center space-x-1">
              <XCircle className="w-4 h-4" />
              <span>Pontos de Divergência</span>
            </h5>
            <div className="space-y-1">
              {analysis.divergencePoints.map((point, index) => (
                <div key={index} className="flex items-start space-x-2 p-2 rounded bg-orange-50">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                  <span className="text-sm text-orange-700">{point}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recomendação por Perfil */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t">
          <div className="p-3 rounded-lg bg-red-50 border border-red-200">
            <div className="text-xs font-medium text-red-800 mb-1">TRADER (Curto Prazo)</div>
            <div className="text-sm text-red-700">
              Foque nos sinais técnicos ({analysis.technicalScore.toFixed(1)}/10)
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
            <div className="text-xs font-medium text-blue-800 mb-1">MISTO (Médio Prazo)</div>
            <div className="text-sm text-blue-700">
              Use análise consolidada ({analysis.finalScore.toFixed(1)}/10)
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
            <div className="text-xs font-medium text-purple-800 mb-1">INVESTIDOR (Longo Prazo)</div>
            <div className="text-sm text-purple-700">
              Priorize fundamentos ({(analysis.fundamentalScore / 10).toFixed(1)}/10)
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsolidatedDecisionPanel;
