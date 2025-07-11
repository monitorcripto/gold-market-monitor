
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { CryptoData } from "@/context/CryptoContext";
import { calculateDecision } from "@/utils/decisionUtils";
import DecisionScore from "./decision/DecisionScore";
import DecisionMetrics from "./decision/DecisionMetrics";
import DecisionReasoning from "./decision/DecisionReasoning";
import HistoricalPerformance from "./decision/HistoricalPerformance";
import IntelligentDecisionPanel from "./decision/IntelligentDecisionPanel";
import TechnicalLevelsPanel from "./decision/TechnicalLevelsPanel";
import SimplifiedDecisionGuide from "./decision/SimplifiedDecisionGuide";
import BeginnerModeToggle from "./decision/BeginnerModeToggle";
import RiskWarning from "./RiskWarning";

interface DecisionDashboardProps {
  crypto: CryptoData;
}

const DecisionDashboard = ({ crypto }: DecisionDashboardProps) => {
  const [isBeginnerMode, setIsBeginnerMode] = useState(true);
  const decision = calculateDecision(crypto);

  return (
    <div className="space-y-6">
      {/* Toggle para Modo Iniciante */}
      <BeginnerModeToggle 
        isBeginnerMode={isBeginnerMode}
        onToggle={setIsBeginnerMode}
      />

      {isBeginnerMode ? (
        /* Modo Iniciante - Interface Simplificada */
        <SimplifiedDecisionGuide crypto={crypto} decision={decision} />
      ) : (
        /* Modo Técnico - Interface Completa */
        <>
          {/* Painel de Decisão Inteligente */}
          <IntelligentDecisionPanel crypto={crypto} decision={decision} />

          {/* Painel de Níveis Técnicos e Projeções */}
          <TechnicalLevelsPanel crypto={crypto} />

          {/* Dashboard de Decisão Original */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5" />
                <span>Análise Técnica Detalhada</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Métricas técnicas e performance do sistema de decisão
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <DecisionScore decision={decision} />
              <DecisionMetrics decision={decision} />
              <DecisionReasoning decision={decision} />
              <HistoricalPerformance />
            </CardContent>
          </Card>
        </>
      )}

      <RiskWarning />
    </div>
  );
};

export default DecisionDashboard;
