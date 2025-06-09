
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

// Type definition for Fear & Greed data from API
interface FearGreedApiResponse {
  name: string;
  data: Array<{
    value: string;
    value_classification: string;
    timestamp: string;
    time_until_update?: string;
  }>;
  metadata: {
    error: string | null;
  };
}

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
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  const fetchFearGreedIndex = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching Fear & Greed Index from API...");
      
      // Using Alternative.me API - free and reliable Fear & Greed Index API
      const response = await fetch(
        "https://api.alternative.me/fng/?limit=1&format=json&date_format=us",
        {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
          cache: 'no-cache'
        }
      );
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      const apiData: FearGreedApiResponse = await response.json();
      console.log("Fear & Greed API Response:", apiData);
      
      if (apiData.metadata?.error) {
        throw new Error(apiData.metadata.error);
      }
      
      if (!apiData.data || apiData.data.length === 0) {
        throw new Error("No data received from API");
      }
      
      const latestData = apiData.data[0];
      
      // Validate the data before processing
      if (!latestData.value || !latestData.value_classification || !latestData.timestamp) {
        throw new Error("Invalid data structure received from API");
      }
      
      const parsedValue = parseInt(latestData.value, 10);
      if (isNaN(parsedValue) || parsedValue < 0 || parsedValue > 100) {
        throw new Error(`Invalid value received: ${latestData.value}`);
      }
      
      const parsedData: FearGreedData = {
        value: parsedValue,
        value_classification: latestData.value_classification,
        timestamp: latestData.timestamp,
        time_until_update: latestData.time_until_update || "24:00:00"
      };
      
      setFearGreedData(parsedData);
      setLastUpdate(new Date());
      console.log("Fear & Greed data updated successfully:", parsedData);
      
    } catch (error) {
      console.error("Failed to fetch Fear & Greed index:", error);
      setError(`Falha ao carregar dados: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
      
      // Only use fallback data if no data exists yet
      if (!fearGreedData) {
        console.log("Using fallback mock data...");
        const mockData: FearGreedData = {
          value: 50,
          value_classification: "Neutral",
          timestamp: Math.floor(Date.now() / 1000).toString(),
          time_until_update: "24:00:00"
        };
        setFearGreedData(mockData);
      }
      setLastUpdate(new Date());
    } finally {
      setLoading(false);
    }
  };
  
  // Initial fetch and periodic updates
  useEffect(() => {
    // Fetch data immediately
    fetchFearGreedIndex();
    
    // Set up automatic updates every 10 minutes (API updates every few hours)
    const updateInterval = setInterval(() => {
      console.log("Automatic Fear & Greed Index update triggered");
      fetchFearGreedIndex();
    }, 10 * 60 * 1000); // 10 minutes in milliseconds
    
    // Cleanup interval on component unmount
    return () => {
      clearInterval(updateInterval);
    };
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
  
  const getFormattedDate = (timestamp: string): string => {
    try {
      // Convert Unix timestamp to Date
      const date = new Date(parseInt(timestamp) * 1000);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid timestamp");
      }
      return date.toLocaleDateString('pt-BR', { 
        day: 'numeric',
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "Data inválida";
    }
  };

  const getFormattedLastUpdate = (): string => {
    if (!lastUpdate) return "Nunca";
    
    return lastUpdate.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && !fearGreedData) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-6 w-40" />
      </div>
    );
  }
  
  if (error && !fearGreedData) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md">
        <p className="font-medium">Erro ao carregar o índice do medo e ganância</p>
        <p className="text-sm mt-1">{error}</p>
        <button 
          onClick={fetchFearGreedIndex}
          className="mt-2 text-sm underline hover:no-underline"
        >
          Tentar novamente
        </button>
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
          <p>Dados de: {getFormattedDate(fearGreedData.timestamp)}</p>
          <p>Última atualização: {getFormattedLastUpdate()}</p>
          {error && (
            <p className="text-orange-600 text-xs mt-1">
              ⚠️ Erro na última atualização
            </p>
          )}
        </div>
      </div>
      
      <div className="relative pt-6 pb-12">
        <div className="relative">
          <Progress 
            value={fearGreedData.value} 
            className="h-4"
          />
          <div 
            className={`absolute top-0 left-0 h-4 rounded-full transition-all ${getColorByValue(fearGreedData.value)}`}
            style={{ width: `${fearGreedData.value}%` }}
          />
        </div>
        
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
        <div className="mt-2 text-xs text-muted-foreground">
          <p>Próxima atualização em: {fearGreedData.time_until_update}</p>
          <p>Atualizações automáticas a cada 10 minutos</p>
          <p className="mt-1 text-blue-600">
            Fonte: Alternative.me Fear & Greed Index API
          </p>
        </div>
      </div>
    </div>
  );
};

export default FearGreedIndex;
