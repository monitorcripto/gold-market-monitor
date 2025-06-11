
import { AlertTriangle, TrendingUp, TrendingDown, Thermometer } from "lucide-react";
import type { MarketSentiment } from "@/types/fearGreed";

export const getColorByValue = (value: number): string => {
  if (value <= 25) return "bg-red-600";
  if (value <= 45) return "bg-orange-500";
  if (value <= 55) return "bg-yellow-500";
  if (value <= 75) return "bg-green-500";
  return "bg-green-700";
};

export const getThermometerColor = (value: number): string => {
  if (value <= 25) return "text-red-600";
  if (value <= 45) return "text-orange-500";
  if (value <= 55) return "text-yellow-500";
  if (value <= 75) return "text-green-500";
  return "text-green-700";
};

export const getBadgeVariant = (value: number): "default" | "secondary" | "destructive" | "outline" => {
  if (value <= 25 || value >= 75) return "destructive";
  if (value <= 45 || value >= 65) return "secondary";
  return "default";
};

export const getClassificationTranslation = (classification: string): string => {
  const translations: Record<string, string> = {
    "Extreme Fear": "Medo Extremo",
    "Fear": "Medo",
    "Neutral": "Neutro",
    "Greed": "Ganância",
    "Extreme Greed": "Ganância Extrema"
  };
  
  return translations[classification] || classification;
};

export const getFormattedDate = (timestamp: string): string => {
  try {
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

export const getMarketSentiment = (value: number): MarketSentiment => {
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
