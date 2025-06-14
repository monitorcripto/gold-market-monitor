
import { Decision } from "@/utils/decisionUtils";

interface DecisionMetricsProps {
  decision: Decision;
}

const DecisionMetrics = ({ decision }: DecisionMetricsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center p-4 rounded-lg bg-muted/50">
        <div className="text-2xl font-bold">{decision.confidence}%</div>
        <div className="text-sm text-muted-foreground">Confiança</div>
      </div>
      <div className="text-center p-4 rounded-lg bg-muted/50">
        <div className="text-2xl font-bold">{decision.timeframe}</div>
        <div className="text-sm text-muted-foreground">Timeframe</div>
      </div>
    </div>
  );
};

export default DecisionMetrics;
