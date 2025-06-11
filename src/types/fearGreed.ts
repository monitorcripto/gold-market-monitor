
export interface FearGreedApiResponse {
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

export interface FearGreedData {
  value: number;
  value_classification: string;
  timestamp: string;
  time_until_update: string;
}

export interface MarketSentiment {
  text: string;
  icon: React.ReactNode;
  description: string;
}
