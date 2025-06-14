
import { getHistoricalAccuracy } from "@/utils/decisionUtils";

const HistoricalPerformance = () => {
  const historicalAccuracy = getHistoricalAccuracy();

  return (
    <div className="space-y-3">
      <h4 className="font-semibold">Performance Histórica do Sistema</h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <div className="text-lg font-bold">{historicalAccuracy.accuracy_percentage}%</div>
          <div className="text-xs text-muted-foreground">Taxa de Acerto</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <div className="text-lg font-bold text-green-600">{historicalAccuracy.profit_loss}</div>
          <div className="text-xs text-muted-foreground">Retorno Total</div>
        </div>
      </div>
      <div className="text-xs text-muted-foreground text-center">
        Baseado em {historicalAccuracy.correct_signals}/{historicalAccuracy.total_signals} sinais nos últimos 30 dias
      </div>
    </div>
  );
};

export default HistoricalPerformance;
