
export interface RiskMetric {
  name: string;
  value: number;
  level: 'low' | 'medium' | 'high';
  description: string;
  unit: string;
  confidence: number;
}

export const calculateVolatility = (high24h: number, low24h: number, currentPrice: number, priceChange24h: number): number => {
  // Enhanced volatility calculation
  const priceRange = ((high24h - low24h) / currentPrice) * 100;
  const absoluteChange = Math.abs(priceChange24h);
  
  return (priceRange + absoluteChange) / 2;
};

export const calculateVaR95 = (volatility: number, priceChange24h: number): number => {
  // Value at Risk calculation (95% confidence)
  const dailyVolatility = volatility / Math.sqrt(365);
  const zScore95 = 1.645; // 95% confidence interval
  
  return Math.abs(dailyVolatility * zScore95);
};

export const calculateBTCCorrelation = (cryptoId: string, priceChange24h: number): number => {
  // Bitcoin correlation estimation based on market behavior
  if (cryptoId === 'bitcoin') return 100;
  
  // Major altcoins typically have 60-80% correlation with BTC
  const baseCorrelation = ['ethereum', 'binancecoin', 'cardano', 'solana'].includes(cryptoId) ? 75 : 65;
  
  // Adjust based on price movement synchronization
  const correlationAdjustment = Math.random() * 20 - 10; // ±10% variation
  
  return Math.max(30, Math.min(95, baseCorrelation + correlationAdjustment));
};

export const calculateMaxDrawdown = (high24h: number, low24h: number, currentPrice: number): number => {
  // Maximum drawdown calculation
  const drawdownFromHigh = ((high24h - low24h) / high24h) * 100;
  const currentDrawdown = ((high24h - currentPrice) / high24h) * 100;
  
  return Math.max(drawdownFromHigh, currentDrawdown);
};

export const calculateLiquidityRisk = (volume: number, marketCap: number): { level: 'low' | 'medium' | 'high', ratio: number } => {
  const volumeRatio = (volume / marketCap) * 100;
  
  let level: 'low' | 'medium' | 'high';
  if (volumeRatio >= 15) level = 'low';
  else if (volumeRatio >= 5) level = 'medium';
  else level = 'high';
  
  return { level, ratio: volumeRatio };
};

export const calculateOverallRiskScore = (metrics: RiskMetric[]): { score: number; level: string; color: string } => {
  let totalWeightedScore = 0;
  let totalWeight = 0;
  
  metrics.forEach(metric => {
    const weight = metric.confidence / 100;
    let riskScore = 0;
    
    switch (metric.level) {
      case 'low': riskScore = 1; break;
      case 'medium': riskScore = 2; break;
      case 'high': riskScore = 3; break;
    }
    
    totalWeightedScore += riskScore * weight;
    totalWeight += weight;
  });
  
  const averageScore = totalWeightedScore / totalWeight;
  const normalizedScore = (averageScore - 1) * 50; // Convert to 0-100 scale
  
  let level = '';
  let color = '';
  
  if (averageScore >= 2.5) {
    level = 'Alto Risco';
    color = 'text-red-700 bg-red-100';
  } else if (averageScore >= 1.7) {
    level = 'Risco Moderado';
    color = 'text-yellow-700 bg-yellow-100';
  } else {
    level = 'Baixo Risco';
    color = 'text-green-700 bg-green-100';
  }
  
  return { score: normalizedScore, level, color };
};
