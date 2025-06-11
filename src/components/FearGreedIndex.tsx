
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingUp, TrendingDown, Thermometer, RefreshCw } from "lucide-react";
import { toast } from "sonner";

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
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  const fetchFearGreedIndex = async (showRefreshingState = false) => {
    try {
      if (showRefreshingState) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
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
      
      // Check for significant changes and show notifications
      if (fearGreedData && fearGreedData.value !== parsedValue) {
        const change = parsedValue - fearGreedData.value;
        setPreviousValue(fearGreedData.value);
        
        if (Math.abs(change) >= 10) {
          const direction = change > 0 ? "aumentou" : "diminuiu";
          toast.info(`Índice de Medo e Ganância ${direction} significativamente`, {
            description: `De ${fearGreedData.value} para ${parsedValue} (${change > 0 ? '+' : ''}${change} pontos)`
          });
        }
        
        // Alert for extreme levels
        if (parsedValue <= 10) {
          toast.error("Medo Extremo Detectado!", {
            description: `Índice em ${parsedValue} - Possível oportunidade de compra`
          });
        } else if (parsedValue >= 90) {
          toast.warning("Ganância Extrema Detectada!", {
            description: `Índice em ${parsedValue} - Cuidado com possível correção`
          });
        }
      }
      
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
      setIsRefreshing(false);
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

  const getThermometerColor = (value: number): string => {
    if (value <= 25) return "text-red-600";
    if (value <= 45) return "text-orange-500";
    if (value <= 55) return "text-yellow-500";
    if (value <= 75) return "text-green-500";
    return "text-green-700";
  };

  const getBadgeVariant = (value: number): "default" | "secondary" | "destructive" | "outline" => {
    if (value <= 25 || value >= 75) return "destructive";
    if (value <= 45 || value >= 65) return "secondary";
    return "default";
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

  const getMarketSentiment = (value: number): { text: string; icon: React.ReactNode; description: string } => {
    if (value <= 10) {
      return {
        text: "Pânico Total",
        icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
        description: "Mercado em pânico extremo - Oportunidades históricas podem surgir"
      };
    } else if (value <= 25) {
      return {
        text: "Medo Extremo",
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
        description: "Investidores muito pessimistas - Possível momento de acumulação"
      };
    } else if (value <= 45) {
      return {
        text: "Medo",
        icon: <TrendingDown className="h-5 w-5 text-orange-500" />,
        description: "Cautela no mercado - Boas oportunidades podem aparecer"
      };
    } else if (value <= 55) {
      return {
        text: "Neutro",
        icon: <Thermometer className="h-5 w-5 text-yellow-500" />,
        description: "Mercado equilibrado - Aguarde sinais mais claros"
      };
    } else if (value <= 75) {
      return {
        text: "Ganância",
        icon: <TrendingUp className="h-5 w-5 text-green-500" />,
        description: "Otimismo crescente - Monitore níveis de resistência"
      };
    } else if (value <= 90) {
      return {
        text: "Ganância Extrema",
        icon: <TrendingUp className="h-5 w-5 text-green-600" />,
        description: "Euforia no mercado - Cuidado com possíveis correções"
      };
    } else {
      return {
        text: "Euforia Total",
        icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
        description: "Mercado superaquecido - Alto risco de correção significativa"
      };
    }
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
          onClick={() => fetchFearGreedIndex()}
          className="mt-2 text-sm underline hover:no-underline"
        >
          Tentar novamente
        </button>
      </div>
    );
  }
  
  if (!fearGreedData) return null;

  const sentiment = getMarketSentiment(fearGreedData.value);

  return (
    <div className="space-y-6">
      {/* Header with value and controls */}
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
            onClick={() => fetchFearGreedIndex(true)}
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
                ⚠️ Erro na última atualização
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Sentiment Alert */}
      {(fearGreedData.value <= 25 || fearGreedData.value >= 75) && (
        <Alert className={fearGreedData.value <= 25 ? "border-red-200 bg-red-50" : "border-orange-200 bg-orange-50"}>
          <div className="flex items-center gap-2">
            {sentiment.icon}
            <AlertDescription>
              <span className="font-semibold">{sentiment.text}:</span> {sentiment.description}
            </AlertDescription>
          </div>
        </Alert>
      )}
      
      {/* Enhanced thermometer visualization */}
      <div className="relative pt-6 pb-12">
        <div className="relative">
          <Progress 
            value={fearGreedData.value} 
            className="h-6 bg-muted"
          />
          <div 
            className={`absolute top-0 left-0 h-6 rounded-full transition-all duration-500 ${getColorByValue(fearGreedData.value)}`}
            style={{ width: `${fearGreedData.value}%` }}
          />
          
          {/* Value indicator */}
          <div 
            className="absolute top-0 w-1 h-6 bg-foreground/80 transition-all duration-500"
            style={{ left: `${fearGreedData.value}%`, transform: 'translateX(-50%)' }}
          />
        </div>
        
        <div className="flex justify-between text-xs mt-2 text-muted-foreground">
          <div className="text-red-600 font-medium">Medo Extremo</div>
          <div>Medo</div>
          <div>Neutro</div>
          <div>Ganância</div>
          <div className="text-green-700 font-medium">Ganância Extrema</div>
        </div>
        
        {/* Scale marks */}
        <div className="absolute -bottom-1 left-0 w-full flex justify-between px-0">
          {[0, 25, 50, 75, 100].map((mark) => (
            <div key={mark} className="flex flex-col items-center">
              <div className="h-3 w-0.5 bg-muted-foreground" />
              <span className="text-xs text-muted-foreground mt-1">{mark}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Information card */}
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
    </div>
  );
};

export default FearGreedIndex;
