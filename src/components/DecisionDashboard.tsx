import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { CryptoData } from "@/context/CryptoContext";
import { calculateDecision } from "@/utils/decisionUtils";
import DecisionScore from "./decision/DecisionScore";
import DecisionMetrics from "./decision/DecisionMetrics";
import DecisionReasoning from "./decision/DecisionReasoning";
import HistoricalPerformance from "./decision/HistoricalPerformance";
import RiskWarning from "./RiskWarning";

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

        <RiskWarning />
      </CardContent>
    </Card>
  );
};

export default DecisionDashboard;
