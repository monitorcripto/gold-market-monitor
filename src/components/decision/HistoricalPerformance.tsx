
import { getHistoricalAccuracy } from "@/utils/decisionUtils";
import { TrendingUp, Target, Award, AlertTriangle } from "lucide-react";

const HistoricalPerformance = () => {
  const historicalAccuracy = getHistoricalAccuracy();

  return (
    <div className="space-y-4">
      <h4 className="font-semibold flex items-center space-x-2">
        <Award className="w-4 h-4" />
        <span>Performance Histórica do Sistema</span>
      </h4>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 rounded-lg bg-green-50 border border-green-200">
          <div className="text-lg font-bold text-green-700">{historicalAccuracy.accuracy_percentage}%</div>
          <div className="text-xs text-green-600">Taxa de Acerto</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-blue-50 border border-blue-200">
          <div className="text-lg font-bold text-blue-700">{historicalAccuracy.profit_loss}</div>
          <div className="text-xs text-blue-600">Retorno Total</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-purple-50 border border-purple-200">
          <div className="text-lg font-bold text-purple-700">{historicalAccuracy.total_signals}</div>
          <div className="text-xs text-purple-600">Sinais Emitidos</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-orange-50 border border-orange-200">
          <div className="text-lg font-bold text-orange-700">{historicalAccuracy.correct_signals}</div>
          <div className="text-xs text-orange-600">Sinais Corretos</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between p-2 rounded bg-green-50">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm">Melhor Performance:</span>
          </div>
          <span className="text-sm font-medium text-green-700">{historicalAccuracy.best_performance}</span>
        </div>
        
        <div className="flex items-center justify-between p-2 rounded bg-yellow-50">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <span className="text-sm">Área de Melhoria:</span>
          </div>
          <span className="text-sm font-medium text-yellow-700">{historicalAccuracy.worst_performance}</span>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground text-center mt-3">
        Baseado em {historicalAccuracy.correct_signals}/{historicalAccuracy.total_signals} sinais nos últimos 90 dias
      </div>
    </div>
  );
};

export default HistoricalPerformance;
