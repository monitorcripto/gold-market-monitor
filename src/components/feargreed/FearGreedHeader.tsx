
import { Thermometer, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getThermometerColor, getBadgeVariant, getClassificationTranslation, getFormattedDate } from "@/utils/fearGreedUtils";
import type { FearGreedData } from "@/types/fearGreed";

interface FearGreedHeaderProps {
  fearGreedData: FearGreedData;
  previousValue: number | null;
  isRefreshing: boolean;
  error: string | null;
  onRefresh: () => void;
  getFormattedLastUpdate: () => string;
}

export const FearGreedHeader = ({ 
  fearGreedData, 
  previousValue, 
  isRefreshing, 
  error, 
  onRefresh,
  getFormattedLastUpdate 
}: FearGreedHeaderProps) => {
  const getTrendIcon = () => {
    if (!previousValue || !fearGreedData) return null;
    
    const change = fearGreedData.value - previousValue;
    if (change > 0) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (change < 0) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
    return null;
  };

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="flex items-center gap-2 mb-1">
            <Thermometer className={`h-8 w-8 ${getThermometerColor(fearGreedData.value)}`} />
            <h3 className="text-4xl font-bold">{fearGreedData.value}</h3>
            {getTrendIcon()}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getBadgeVariant(fearGreedData.value)}>
              {getClassificationTranslation(fearGreedData.value_classification)}
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? "Atualizando..." : "Atualizar"}
        </Button>
        <div className="text-sm text-muted-foreground text-right">
          <p>Dados de: {getFormattedDate(fearGreedData.timestamp)}</p>
          <p>Última atualização: {getFormattedLastUpdate()}</p>
          {error && (
            <p className="text-orange-600 text-xs mt-1">
              ⚠️ {error.includes('Falha ao carregar') ? 'Erro na conexão com a API' : 'Erro na última atualização'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
