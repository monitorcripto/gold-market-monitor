
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, TrendingUp, TrendingDown } from "lucide-react";
import { CryptoData } from "@/context/CryptoContext";
import { Decision } from "@/utils/decisionUtils";

interface MarketFact {
  id: string;
  description: string;
  isPositive: boolean;
  category: 'price' | 'volume' | 'market' | 'technical';
}

interface MarketFactsListProps {
  crypto: CryptoData;
  decision: Decision;
}

const MarketFactsList = ({ crypto, decision }: MarketFactsListProps) => {
  const generateMarketFacts = (): MarketFact[] => {
    const facts: MarketFact[] = [];
    
    // Price-related facts
    if (crypto.price_change_percentage_24h > 5) {
      facts.push({
        id: 'price_up_strong',
        description: `Preço subiu ${crypto.price_change_percentage_24h.toFixed(2)}% nas últimas 24h - movimento forte`,
        isPositive: true,
        category: 'price'
      });
    } else if (crypto.price_change_percentage_24h > 0) {
      facts.push({
        id: 'price_up',
        description: `Preço em alta de ${crypto.price_change_percentage_24h.toFixed(2)}% no dia`,
        isPositive: true,
        category: 'price'
      });
    } else if (crypto.price_change_percentage_24h < -5) {
      facts.push({
        id: 'price_down_strong',
        description: `Preço caiu ${Math.abs(crypto.price_change_percentage_24h).toFixed(2)}% nas últimas 24h - queda acentuada`,
        isPositive: false,
        category: 'price'
      });
    } else if (crypto.price_change_percentage_24h < 0) {
      facts.push({
        id: 'price_down',
        description: `Preço em baixa de ${Math.abs(crypto.price_change_percentage_24h).toFixed(2)}% no dia`,
        isPositive: false,
        category: 'price'
      });
    }

    // Volume-related facts
    const avgVolume = crypto.market_cap * 0.1; // Estimate based on market cap
    if (crypto.total_volume > avgVolume * 1.5) {
      facts.push({
        id: 'volume_high',
        description: 'Volume de negociação acima da média - maior interesse do mercado',
        isPositive: true,
        category: 'volume'
      });
    } else if (crypto.total_volume < avgVolume * 0.5) {
      facts.push({
        id: 'volume_low',
        description: 'Volume de negociação baixo - pouco interesse do mercado',
        isPositive: false,
        category: 'volume'
      });
    }

    // Market position facts
    if (crypto.market_cap_rank <= 10) {
      facts.push({
        id: 'top_crypto',
        description: `Criptomoeda top ${crypto.market_cap_rank} - alta liquidez e estabilidade`,
        isPositive: true,
        category: 'market'
      });
    } else if (crypto.market_cap_rank <= 50) {
      facts.push({
        id: 'established_crypto',
        description: `Posição ${crypto.market_cap_rank} no ranking - criptomoeda estabelecida`,
        isPositive: true,
        category: 'market'
      });
    } else if (crypto.market_cap_rank > 100) {
      facts.push({
        id: 'small_cap',
        description: `Posição ${crypto.market_cap_rank} no ranking - maior risco e volatilidade`,
        isPositive: false,
        category: 'market'
      });
    }

    // Technical analysis-based facts
    if (decision.score > 75) {
      facts.push({
        id: 'technical_strong_buy',
        description: 'Análise técnica indica sinal forte de compra',
        isPositive: true,
        category: 'technical'
      });
    } else if (decision.score > 60) {
      facts.push({
        id: 'technical_buy',
        description: 'Indicadores técnicos sugerem oportunidade de compra',
        isPositive: true,
        category: 'technical'
      });
    } else if (decision.score < 25) {
      facts.push({
        id: 'technical_strong_sell',
        description: 'Análise técnica indica sinal forte de venda',
        isPositive: false,
        category: 'technical'
      });
    } else if (decision.score < 40) {
      facts.push({
        id: 'technical_sell',
        description: 'Indicadores técnicos sugerem cautela ou venda',
        isPositive: false,
        category: 'technical'
      });
    }

    // Risk level facts
    if (decision.riskLevel === 'low') {
      facts.push({
        id: 'low_risk',
        description: 'Nível de risco baixo identificado',
        isPositive: true,
        category: 'market'
      });
    } else if (decision.riskLevel === 'high') {
      facts.push({
        id: 'high_risk',
        description: 'Alto nível de risco identificado',
        isPositive: false,
        category: 'market'
      });
    }

    // Price range facts
    const priceRange = ((crypto.high_24h - crypto.low_24h) / crypto.current_price) * 100;
    if (priceRange > 10) {
      facts.push({
        id: 'high_volatility',
        description: `Alta volatilidade: variação de ${priceRange.toFixed(1)}% no dia`,
        isPositive: false,
        category: 'price'
      });
    } else if (priceRange < 3) {
      facts.push({
        id: 'low_volatility',
        description: `Baixa volatilidade: variação de apenas ${priceRange.toFixed(1)}% no dia`,
        isPositive: true,
        category: 'price'
      });
    }

    return facts;
  };

  const facts = generateMarketFacts();
  const positiveFacts = facts.filter(fact => fact.isPositive);
  const negativeFacts = facts.filter(fact => !fact.isPositive);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'price': return 'bg-blue-100 text-blue-800';
      case 'volume': return 'bg-purple-100 text-purple-800';
      case 'market': return 'bg-green-100 text-green-800';
      case 'technical': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'price': return 'Preço';
      case 'volume': return 'Volume';
      case 'market': return 'Mercado';
      case 'technical': return 'Técnico';
      default: return 'Geral';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5" />
          <span>Fatos do Mercado - {crypto.name}</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Análise dos principais fatores que podem influenciar sua decisão
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <Check className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">Fatos Positivos</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{positiveFacts.length}</div>
          </div>
          
          <div className="text-center p-4 rounded-lg bg-red-50 border border-red-200">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <X className="w-5 h-5 text-red-600" />
              <span className="font-semibold text-red-800">Fatos Negativos</span>
            </div>
            <div className="text-2xl font-bold text-red-600">{negativeFacts.length}</div>
          </div>

          <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Saldo</span>
            </div>
            <div className={`text-2xl font-bold ${positiveFacts.length > negativeFacts.length ? 'text-green-600' : positiveFacts.length < negativeFacts.length ? 'text-red-600' : 'text-gray-600'}`}>
              {positiveFacts.length > negativeFacts.length ? '+' : ''}
              {positiveFacts.length - negativeFacts.length}
            </div>
          </div>
        </div>

        {/* Decision Guidance */}
        <div className={`p-4 rounded-lg border-2 ${
          positiveFacts.length > negativeFacts.length 
            ? 'bg-green-50 border-green-300' 
            : positiveFacts.length < negativeFacts.length 
              ? 'bg-red-50 border-red-300' 
              : 'bg-yellow-50 border-yellow-300'
        }`}>
          <div className="font-semibold mb-2">
            {positiveFacts.length > negativeFacts.length 
              ? '✅ Mais fatores positivos identificados' 
              : positiveFacts.length < negativeFacts.length 
                ? '⚠️ Mais fatores negativos identificados' 
                : '⚖️ Fatores positivos e negativos equilibrados'
            }
          </div>
          <p className="text-sm">
            {positiveFacts.length > negativeFacts.length 
              ? 'Os dados sugerem um cenário mais favorável para manter ou aumentar a posição.' 
              : positiveFacts.length < negativeFacts.length 
                ? 'Os dados indicam cautela e possível redução de exposição ao risco.' 
                : 'Cenário neutro. Considere aguardar sinais mais claros antes de decidir.'
            }
          </p>
        </div>

        {/* Detailed Facts List */}
        <div className="space-y-3">
          <h4 className="font-semibold text-lg">Detalhamento dos Fatos</h4>
          
          {facts.map((fact) => (
            <div key={fact.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
              <div className={`p-1 rounded-full ${fact.isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
                {fact.isPositive ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <X className="w-4 h-4 text-red-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium">{fact.description}</span>
                  <Badge className={getCategoryColor(fact.category)}>
                    {getCategoryLabel(fact.category)}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        {facts.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            Não há fatos significativos para análise no momento.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MarketFactsList;
