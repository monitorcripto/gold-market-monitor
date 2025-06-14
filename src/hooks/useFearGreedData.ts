
import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { FearGreedData, FearGreedApiResponse } from "@/types/fearGreed";

export const useFearGreedData = () => {
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
      
      // Clear any previous error
      setError(null);
      
      console.log("Fetching Fear & Greed Index from API...");
      
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
      setError(null); // Clear error on success
      console.log("Fear & Greed data updated successfully:", parsedData);
      
    } catch (error) {
      console.error("Failed to fetch Fear & Greed index:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      setError(`Falha ao carregar dados: ${errorMessage}`);
      
      // Only use fallback data if we don't have any data yet
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
  
  useEffect(() => {
    fetchFearGreedIndex();
    
    // Set up interval for automatic updates every 10 minutes
    const updateInterval = setInterval(() => {
      console.log("Automatic Fear & Greed Index update triggered");
      fetchFearGreedIndex();
    }, 10 * 60 * 1000);
    
    return () => {
      clearInterval(updateInterval);
    };
  }, []);

  const getFormattedLastUpdate = (): string => {
    if (!lastUpdate) return "Nunca";
    
    return lastUpdate.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return {
    fearGreedData,
    previousValue,
    loading,
    error,
    isRefreshing,
    fetchFearGreedIndex,
    getFormattedLastUpdate
  };
};
