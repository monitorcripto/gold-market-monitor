
import { getMarketSentiment } from "@/utils/fearGreedUtils";
import type { FearGreedData } from "@/types/fearGreed";

interface FearGreedInfoCardProps {
  fearGreedData: FearGreedData;
  previousValue: number | null;
}

export const FearGreedInfoCard = ({ fearGreedData, previousValue }: FearGreedInfoCardProps) => {
  const sentiment = getMarketSentiment(fearGreedData.value);

  return (
    <div className="bg-muted p-4 rounded-md">
      <div className="flex items-start gap-3 mb-3">
        {sentiment.icon}
        <div>
          <h4 className="font-medium">{sentiment.text}</h4>
          <p className="text-sm text-muted-foreground mt-1">{sentiment.description}</p>
        </div>
      </div>
      
      <div className="border-t border-border pt-3 mt-3">
        <h4 className="font-medium mb-2">O que é o Índice do Medo e Ganância?</h4>
        <p className="text-sm text-muted-foreground">
          Este indicador analisa o sentimento atual do mercado de criptomoedas. Quando o índice mostra "Medo Extremo", 
          geralmente indica que investidores estão muito preocupados, o que pode ser uma oportunidade de compra. 
          Por outro lado, quando mostra "Ganância Extrema", o mercado pode estar sobrevalorizado e uma correção pode estar próxima.
        </p>
        <div className="mt-3 text-xs text-muted-foreground space-y-1">
          <p>• Próxima atualização em: {fearGreedData.time_until_update}</p>
          <p>• Atualizações automáticas a cada 10 minutos</p>
          <p>• Fonte: Alternative.me Fear & Greed Index API</p>
          {previousValue && (
            <p>• Variação desde a última atualização: {fearGreedData.value - previousValue > 0 ? '+' : ''}{fearGreedData.value - previousValue} pontos</p>
          )}
        </div>
      </div>
    </div>
  );
};
