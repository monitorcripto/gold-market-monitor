
import { Decision } from "@/utils/decisionUtils";
import InfoTooltip from "@/components/InfoTooltip";

interface DecisionMetricsProps {
  decision: Decision;
}

const DecisionMetrics = ({ decision }: DecisionMetricsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center p-4 rounded-lg bg-muted/50">
        <div className="flex items-center justify-center space-x-2 mb-1">
          <div className="text-2xl font-bold">{decision.confidence}%</div>
          <InfoTooltip content="Nível de confiança da análise baseado na convergência de indicadores técnicos e condições de mercado" />
        </div>
        <div className="text-sm text-muted-foreground">Confiança</div>
      </div>
      <div className="text-center p-4 rounded-lg bg-muted/50">
        <div className="flex items-center justify-center space-x-2 mb-1">
          <div className="text-2xl font-bold">{decision.timeframe}</div>
          <InfoTooltip content="Horizonte temporal recomendado para esta análise e decisão de investimento" />
        </div>
        <div className="text-sm text-muted-foreground">Timeframe</div>
      </div>
    </div>
  );
};

export default DecisionMetrics;
