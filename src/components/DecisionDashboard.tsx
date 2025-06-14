
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { CryptoData } from "@/context/CryptoContext";
import { calculateDecision } from "@/utils/decisionUtils";
import DecisionScore from "./decision/DecisionScore";
import DecisionMetrics from "./decision/DecisionMetrics";
import DecisionReasoning from "./decision/DecisionReasoning";
import HistoricalPerformance from "./decision/HistoricalPerformance";

interface DecisionDashboardProps {
  crypto: CryptoData;
}

const DecisionDashboard = ({ crypto }: DecisionDashboardProps) => {
  const decision = calculateDecision(crypto);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="w-5 h-5" />
          <span>Dashboard de Decisão</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <DecisionScore decision={decision} />
        <DecisionMetrics decision={decision} />
        <DecisionReasoning decision={decision} />
        <HistoricalPerformance />

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
