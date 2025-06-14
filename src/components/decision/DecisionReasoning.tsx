
import { Target } from "lucide-react";
import { Decision } from "@/utils/decisionUtils";

interface DecisionReasoningProps {
  decision: Decision;
}

const DecisionReasoning = ({ decision }: DecisionReasoningProps) => {
  return (
    <div className="space-y-3">
      <h4 className="font-semibold flex items-center space-x-2">
        <Target className="w-4 h-4" />
        <span>Fundamentos da Decisão</span>
      </h4>
      <div className="space-y-2">
        {decision.reasoning.map((reason, index) => (
          <div key={index} className="flex items-start space-x-2 p-2 rounded bg-muted/30">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
            <span className="text-sm">{reason}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DecisionReasoning;
