
import type { CryptoData } from "@/context/CryptoContext";

export interface TradingSignal {
  type: string;
  strength: number;
  signal: 'strong_buy' | 'buy' | 'neutral' | 'sell' | 'strong_sell';
  description: string;
  confidence: number;
  weight: number;
}

export const analyzeCandlestickPattern = (crypto: CryptoData): TradingSignal => {
  const { current_price, high_24h, low_24h, price_change_percentage_24h } = crypto;
  const priceRange = high_24h - low_24h;
  const bodySize = Math.abs(price_change_percentage_24h);
  
  let signal: TradingSignal['signal'] = 'neutral';
  let strength = 5;
  let description = 'Padrão neutro identificado';
  let confidence = 60;
  
  // Doji pattern (small body, high uncertainty)
  if (bodySize < 1 && priceRange > current_price * 0.02) {
    signal = 'neutral';
    description = 'Padrão Doji - Indecisão do mercado';
    confidence = 70;
  }
  // Strong bullish pattern
  else if (price_change_percentage_24h > 5 && current_price > (low_24h + priceRange * 0.7)) {
    signal = price_change_percentage_24h > 10 ? 'strong_buy' : 'buy';
    strength = Math.min(9, 6 + bodySize / 2);
    description = 'Padrão de alta forte - Momentum positivo';
    confidence = 80;
  }
  // Strong bearish pattern
  else if (price_change_percentage_24h < -5 && current_price < (high_24h - priceRange * 0.7)) {
    signal = price_change_percentage_24h < -10 ? 'strong_sell' : 'sell';
    strength = Math.min(9, 6 + bodySize / 2);
    description = 'Padrão de baixa forte - Pressão vendedora';
    confidence = 80;
  }
  
  return {
    type: 'Análise de Candlestick',
    strength,
    signal,
    description,
    confidence,
    weight: 0.25
  };
};

export const analyzeVolumeProfile = (crypto: CryptoData): TradingSignal => {
  const { total_volume, market_cap, price_change_percentage_24h } = crypto;
  const volumeRatio = total_volume / market_cap;
  
  let signal: TradingSignal['signal'] = 'neutral';
  let strength = 5;
  let description = 'Volume normal';
  let confidence = 65;
  
  // High volume with price increase
  if (volumeRatio > 0.15 && price_change_percentage_24h > 2) {
    signal = volumeRatio > 0.25 ? 'strong_buy' : 'buy';
    strength = Math.min(9, 7 + volumeRatio * 10);
    description = 'Volume anômalo com alta - Forte interesse comprador';
    confidence = 85;
  }
  // High volume with price decrease
  else if (volumeRatio > 0.15 && price_change_percentage_24h < -2) {
    signal = volumeRatio > 0.25 ? 'strong_sell' : 'sell';
    strength = Math.min(9, 7 + volumeRatio * 10);
    description = 'Volume anômalo com baixa - Forte pressão vendedora';
    confidence = 85;
  }
  // Low volume
  else if (volumeRatio < 0.05) {
    signal = 'neutral';
    strength = 3;
    description = 'Volume baixo - Falta de interesse do mercado';
    confidence = 70;
  }
  
  return {
    type: 'Perfil de Volume',
    strength,
    signal,
    description,
    confidence,
    weight: 0.3
  };
};

export const analyzeMomentum = (crypto: CryptoData): TradingSignal => {
  const { price_change_percentage_24h, current_price, high_24h, low_24h } = crypto;
  const pricePosition = (current_price - low_24h) / (high_24h - low_24h);
  
  let signal: TradingSignal['signal'] = 'neutral';
  let strength = 5;
  let description = 'Momentum neutro';
  let confidence = 70;
  
  // Strong upward momentum
  if (price_change_percentage_24h > 3 && pricePosition > 0.6) {
    signal = price_change_percentage_24h > 8 ? 'strong_buy' : 'buy';
    strength = Math.min(9, 6 + price_change_percentage_24h / 2);
    description = 'Momentum de alta forte - Tendência positiva';
    confidence = 80;
  }
  // Strong downward momentum
  else if (price_change_percentage_24h < -3 && pricePosition < 0.4) {
    signal = price_change_percentage_24h < -8 ? 'strong_sell' : 'sell';
    strength = Math.min(9, 6 + Math.abs(price_change_percentage_24h) / 2);
    description = 'Momentum de baixa forte - Tendência negativa';
    confidence = 80;
  }
  
  return {
    type: 'Análise de Momentum',
    strength,
    signal,
    description,
    confidence,
    weight: 0.25
  };
};

export const analyzeSupportResistance = (crypto: CryptoData): TradingSignal => {
  const { current_price, high_24h, low_24h } = crypto;
  const priceRange = high_24h - low_24h;
  const pricePosition = (current_price - low_24h) / priceRange;
  
  let signal: TradingSignal['signal'] = 'neutral';
  let strength = 6;
  let description = 'Entre suporte e resistência';
  let confidence = 75;
  
  // Near resistance (top 20% of range)
  if (pricePosition > 0.8) {
    signal = pricePosition > 0.95 ? 'strong_sell' : 'sell';
    strength = Math.min(9, 6 + (pricePosition - 0.8) * 15);
    description = 'Próximo à resistência - Possível reversão de baixa';
    confidence = 80;
  }
  // Near support (bottom 20% of range)
  else if (pricePosition < 0.2) {
    signal = pricePosition < 0.05 ? 'strong_buy' : 'buy';
    strength = Math.min(9, 6 + (0.2 - pricePosition) * 15);
    description = 'Próximo ao suporte - Possível reversão de alta';
    confidence = 80;
  }
  
  return {
    type: 'Suporte/Resistência',
    strength,
    signal,
    description,
    confidence,
    weight: 0.2
  };
};

export const calculateOverallScore = (signals: TradingSignal[]): { score: number; recommendation: string; color: string; confidence: number } => {
  let totalWeightedScore = 0;
  let totalWeight = 0;
  let totalConfidence = 0;
  
  signals.forEach(signal => {
    const weight = signal.weight;
    let signalScore = 0;
    
    switch (signal.signal) {
      case 'strong_buy': signalScore = 10; break;
      case 'buy': signalScore = 7; break;
      case 'neutral': signalScore = 5; break;
      case 'sell': signalScore = 3; break;
      case 'strong_sell': signalScore = 1; break;
    }
    
    totalWeightedScore += signalScore * weight * (signal.confidence / 100);
    totalWeight += weight;
    totalConfidence += signal.confidence * weight;
  });
  
  const finalScore = totalWeightedScore / totalWeight;
  const avgConfidence = totalConfidence / totalWeight;
  
  let recommendation = '';
  let color = '';
  
  if (finalScore >= 8) {
    recommendation = 'COMPRA FORTE';
    color = 'text-green-700 bg-green-100';
  } else if (finalScore >= 6.5) {
    recommendation = 'COMPRA';
    color = 'text-green-600 bg-green-50';
  } else if (finalScore >= 3.5) {
    recommendation = 'NEUTRO';
    color = 'text-gray-600 bg-gray-100';
  } else if (finalScore >= 2) {
    recommendation = 'VENDA';
    color = 'text-red-600 bg-red-50';
  } else {
    recommendation = 'VENDA FORTE';
    color = 'text-red-700 bg-red-100';
  }
  
  return { score: finalScore, recommendation, color, confidence: avgConfidence };
};
