
import { CryptoData } from "@/context/CryptoContext";

export interface TechnicalLevels {
  currentPrice: number;
  support: number;
  resistance: number;
  projection: {
    bullish: number;
    bearish: number;
    neutral: number;
    timeframe: string;
  };
  confidence: number;
}

export const calculateTechnicalLevels = (crypto: CryptoData): TechnicalLevels => {
  const { current_price, high_24h, low_24h, price_change_percentage_24h, total_volume, market_cap } = crypto;
  
  // Calcular suporte baseado em low 24h e momentum
  const supportBase = low_24h;
  const supportAdjustment = price_change_percentage_24h < 0 ? 
    supportBase * (1 - Math.abs(price_change_percentage_24h) * 0.01) : 
    supportBase * 0.98;
  const support = Math.max(supportAdjustment, supportBase * 0.92);
  
  // Calcular resistência baseado em high 24h e volume
  const resistanceBase = high_24h;
  const volumeWeight = (total_volume / market_cap) > 0.1 ? 1.02 : 1.01;
  const resistance = resistanceBase * volumeWeight;
  
  // Calcular projeções baseadas em análise técnica
  const volatility = ((high_24h - low_24h) / current_price) * 100;
  const momentum = price_change_percentage_24h;
  
  // Projeção bullish (cenário otimista)
  const bullishMultiplier = momentum > 5 ? 1.15 : momentum > 0 ? 1.08 : 1.05;
  const bullish = current_price * bullishMultiplier;
  
  // Projeção bearish (cenário pessimista) 
  const bearishMultiplier = momentum < -5 ? 0.85 : momentum < 0 ? 0.92 : 0.95;
  const bearish = current_price * bearishMultiplier;
  
  // Projeção neutral (cenário mais provável)
  const neutralAdjustment = momentum * 0.003; // 0.3% por cada 1% de mudança
  const neutral = current_price * (1 + neutralAdjustment);
  
  // Calcular confiança baseada em volume e volatilidade
  const volumeConfidence = Math.min(90, (total_volume / market_cap) * 500);
  const volatilityPenalty = volatility > 10 ? 15 : volatility > 5 ? 8 : 0;
  const confidence = Math.max(50, Math.min(95, volumeConfidence - volatilityPenalty + 60));
  
  return {
    currentPrice: current_price,
    support: Math.round(support * 100) / 100,
    resistance: Math.round(resistance * 100) / 100,
    projection: {
      bullish: Math.round(bullish * 100) / 100,
      bearish: Math.round(bearish * 100) / 100,
      neutral: Math.round(neutral * 100) / 100,
      timeframe: '7-14 dias'
    },
    confidence: Math.round(confidence)
  };
};
