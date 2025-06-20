
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { Decision } from "@/utils/decisionUtils";
import InfoTooltip from "@/components/InfoTooltip";

interface DecisionScoreProps {
  decision: Decision;
}

const DecisionScore = ({ decision }: DecisionScoreProps) => {
  const getActionDetails = (action: string) => {
    const details = {
      strong_buy: {
        label: 'COMPRA FORTE',
        color: 'text-green-800 bg-green-200',
        icon: <TrendingUp className="w-5 h-5" />,
        description: 'Sinal muito forte de compra'
      },
      buy: {
        label: 'COMPRA',
        color: 'text-green-700 bg-green-100',
        icon: <TrendingUp className="w-4 h-4" />,
        description: 'Sinal de compra'
      },
      hold: {
        label: 'MANTER',
        color: 'text-gray-700 bg-gray-100',
        icon: <BarChart3 className="w-4 h-4" />,
        description: 'Manter posição atual'
      },
      sell: {
        label: 'VENDA',
        color: 'text-red-700 bg-red-100',
        icon: <TrendingDown className="w-4 h-4" />,
        description: 'Sinal de venda'
      },
      strong_sell: {
        label: 'VENDA FORTE',
        color: 'text-red-800 bg-red-200',
        icon: <TrendingDown className="w-5 h-5" />,
        description: 'Sinal muito forte de venda'
      }
    };
    
    return details[action as keyof typeof details];
  };

  const actionDetails = getActionDetails(decision.action);

  return (
    <div className="text-center p-6 rounded-lg border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="space-y-4">
        <div className="flex justify-center items-center space-x-2">
          {actionDetails.icon}
          <InfoTooltip content="Score de decisão calculado com base em múltiplos indicadores técnicos, volume, momentum e análise de risco" />
        </div>
        <div>
          <div className="text-4xl font-bold mb-2">{decision.score}/100</div>
          <Badge className={`${actionDetails.color} text-xl px-6 py-3`}>
            {actionDetails.label}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          {actionDetails.description}
        </div>
        <Progress value={decision.score} className="h-4" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Venda Forte</span>
          <span>Neutro</span>
          <span>Compra Forte</span>
        </div>
      </div>
    </div>
  );
};

export default DecisionScore;
