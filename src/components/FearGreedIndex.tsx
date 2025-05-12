
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

// Type definition for Fear & Greed data
interface FearGreedData {
  value: number;
  value_classification: string;
  timestamp: string;
  time_until_update: string;
}

const FearGreedIndex = () => {
  const [fearGreedData, setFearGreedData] = useState<FearGreedData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // In a real application, you would fetch from a real API
    // For now, we'll simulate a Fear & Greed index
    const fetchFearGreedIndex = async () => {
      try {
        setLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create a random value between 0 and 100
        const randomValue = Math.floor(Math.random() * 100);
        let classification = "Neutral";
        
        if (randomValue <= 25) {
          classification = "Extreme Fear";
        } else if (randomValue <= 45) {
          classification = "Fear";
        } else if (randomValue <= 55) {
          classification = "Neutral";
        } else if (randomValue <= 75) {
          classification = "Greed";
        } else {
          classification = "Extreme Greed";
        }
        
        const now = new Date();
        setFearGreedData({
          value: randomValue,
          value_classification: classification,
          timestamp: now.toISOString(),
          time_until_update: "12:00:00"
        });
        setError(null);
      } catch (err) {
        setError("Failed to fetch Fear & Greed index");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFearGreedIndex();
  }, []);
  
  const getColorByValue = (value: number): string => {
    if (value <= 25) return "bg-red-600";
    if (value <= 45) return "bg-orange-500";
    if (value <= 55) return "bg-yellow-500";
    if (value <= 75) return "bg-green-500";
    return "bg-green-700";
  };
  
  const getClassificationTranslation = (classification: string): string => {
    const translations: Record<string, string> = {
      "Extreme Fear": "Medo Extremo",
      "Fear": "Medo",
      "Neutral": "Neutro",
      "Greed": "Ganância",
      "Extreme Greed": "Ganância Extrema"
    };
    
    return translations[classification] || classification;
  };
  
  const getFormattedDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: 'numeric',
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-6 w-40" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md">
        Erro ao carregar o índice do medo e ganância. Por favor, tente novamente mais tarde.
      </div>
    );
  }
  
  if (!fearGreedData) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h3 className="text-4xl font-bold">{fearGreedData.value}</h3>
          <p className="text-lg font-medium">
            {getClassificationTranslation(fearGreedData.value_classification)}
          </p>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>Atualizado em: {getFormattedDate(fearGreedData.timestamp)}</p>
        </div>
      </div>
      
      <div className="relative pt-6 pb-12">
        <Progress 
          value={fearGreedData.value} 
          className="h-4" 
          indicatorClassName={getColorByValue(fearGreedData.value)}
        />
        
        <div className="flex justify-between text-xs mt-1 text-muted-foreground">
          <div className="text-red-600 font-medium">Medo Extremo</div>
          <div>Medo</div>
          <div>Neutro</div>
          <div>Ganância</div>
          <div className="text-green-700 font-medium">Ganância Extrema</div>
        </div>
        
        <div className="absolute -bottom-1 left-0 w-full flex justify-between px-0">
          <div className="w-0">
            <div className="h-3 w-0.5 bg-muted-foreground" />
          </div>
          <div className="w-0">
            <div className="h-3 w-0.5 bg-muted-foreground" />
          </div>
          <div className="w-0">
            <div className="h-3 w-0.5 bg-muted-foreground" />
          </div>
          <div className="w-0">
            <div className="h-3 w-0.5 bg-muted-foreground" />
          </div>
          <div className="w-0">
            <div className="h-3 w-0.5 bg-muted-foreground" />
          </div>
        </div>
      </div>
      
      <div className="bg-muted p-4 rounded-md">
        <h4 className="font-medium mb-2">O que é o Índice do Medo e Ganância?</h4>
        <p className="text-sm text-muted-foreground">
          Este indicador analisa o sentimento atual do mercado de criptomoedas. Quando o índice mostra "Medo Extremo", 
          geralmente indica que investidores estão muito preocupados, o que pode ser uma oportunidade de compra. 
          Por outro lado, quando mostra "Ganância Extrema", o mercado pode estar sobrevalorizado e uma correção pode estar próxima.
        </p>
      </div>
    </div>
  );
};

export default FearGreedIndex;
