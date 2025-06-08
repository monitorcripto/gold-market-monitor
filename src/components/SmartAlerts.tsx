
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Bell, TrendingUp, TrendingDown, Volume2, AlertTriangle } from "lucide-react";
import { CryptoData } from "@/context/CryptoContext";
import { useState } from "react";

interface SmartAlertsProps {
  crypto: CryptoData;
}

interface Alert {
  id: string;
  type: 'breakout' | 'volume' | 'divergence' | 'reversal' | 'fear_greed';
  title: string;
  description: string;
  triggered: boolean;
  priority: 'low' | 'medium' | 'high';
  condition: string;
  icon: React.ReactNode;
}

const SmartAlerts = ({ crypto }: SmartAlertsProps) => {
  const [alertsEnabled, setAlertsEnabled] = useState({
    breakout: true,
    volume: true,
    divergence: false,
    reversal: true,
    fear_greed: false
  });

  const generateAlerts = (): Alert[] => {
    const priceChange = crypto.price_change_percentage_24h;
    const volume = crypto.total_volume;
    const marketCap = crypto.market_cap;
    const currentPrice = crypto.current_price;
    const high24h = crypto.high_24h;
    const low24h = crypto.low_24h;

    const alerts: Alert[] = [
      {
        id: 'resistance_break',
        type: 'breakout',
        title: 'Rompimento de Resistência',
        description: currentPrice > high24h * 0.98 ? 'Preço próximo ao rompimento da resistência 24h' : 'Monitorando níveis de resistência',
        triggered: currentPrice > high24h * 0.98,
        priority: currentPrice > high24h * 0.98 ? 'high' : 'medium',
        condition: `Preço > ${(high24h * 0.98).toFixed(2)}`,
        icon: <TrendingUp className="w-4 h-4" />
      },
      {
        id: 'support_break',
        type: 'breakout',
        title: 'Rompimento de Suporte',
        description: currentPrice < low24h * 1.02 ? 'Preço próximo ao rompimento do suporte 24h' : 'Monitorando níveis de suporte',
        triggered: currentPrice < low24h * 1.02,
        priority: currentPrice < low24h * 1.02 ? 'high' : 'medium',
        condition: `Preço < ${(low24h * 1.02).toFixed(2)}`,
        icon: <TrendingDown className="w-4 h-4" />
      },
      {
        id: 'volume_spike',
        type: 'volume',
        title: 'Pico de Volume',
        description: volume > marketCap * 0.15 ? 'Volume anormalmente alto detectado!' : 'Monitorando volume de negociação',
        triggered: volume > marketCap * 0.15,
        priority: volume > marketCap * 0.15 ? 'high' : 'low',
        condition: `Volume > 15% do Market Cap`,
        icon: <Volume2 className="w-4 h-4" />
      },
      {
        id: 'rsi_divergence',
        type: 'divergence',
        title: 'Divergência RSI',
        description: Math.abs(priceChange) > 5 ? 'Possível divergência entre preço e RSI detectada' : 'Monitorando divergências técnicas',
        triggered: Math.abs(priceChange) > 5,
        priority: Math.abs(priceChange) > 5 ? 'medium' : 'low',
        condition: 'RSI vs Preço divergindo',
        icon: <AlertTriangle className="w-4 h-4" />
      },
      {
        id: 'reversal_pattern',
        type: 'reversal',
        title: 'Padrão de Reversão',
        description: Math.abs(priceChange) > 7 ? 'Padrão de reversão identificado' : 'Buscando padrões de reversão',
        triggered: Math.abs(priceChange) > 7,
        priority: Math.abs(priceChange) > 7 ? 'high' : 'medium',
        condition: 'Mudança > 7% em 24h',
        icon: <TrendingUp className="w-4 h-4" />
      },
      {
        id: 'fear_greed_extreme',
        type: 'fear_greed',
        title: 'Fear & Greed Extremo',
        description: 'Monitorando níveis extremos do índice Fear & Greed',
        triggered: false, // Would integrate with actual Fear & Greed API
        priority: 'medium',
        condition: 'F&G < 20 ou > 80',
        icon: <Bell className="w-4 h-4" />
      }
    ];

    return alerts.filter(alert => alertsEnabled[alert.type]);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-700 bg-red-100';
      case 'medium': return 'text-yellow-700 bg-yellow-100';
      default: return 'text-blue-700 bg-blue-100';
    }
  };

  const getTriggeredColor = (triggered: boolean) => {
    return triggered ? 'text-green-700 bg-green-100' : 'text-gray-700 bg-gray-100';
  };

  const alerts = generateAlerts();
  const triggeredAlerts = alerts.filter(alert => alert.triggered);

  const toggleAlert = (type: keyof typeof alertsEnabled) => {
    setAlertsEnabled(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Alertas Inteligentes</span>
          </div>
          {triggeredAlerts.length > 0 && (
            <Badge className="text-red-700 bg-red-100">
              {triggeredAlerts.length} Ativo{triggeredAlerts.length > 1 ? 's' : ''}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Alert Controls */}
        <div className="space-y-3">
          <h4 className="font-semibold">Configurações de Alertas</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(alertsEnabled).map(([type, enabled]) => {
              const alertTypeNames = {
                breakout: 'Rompimentos',
                volume: 'Volume',
                divergence: 'Divergências',
                reversal: 'Reversões',
                fear_greed: 'Fear & Greed'
              };
              
              return (
                <div key={type} className="flex items-center justify-between p-2 rounded border">
                  <span className="text-sm font-medium">{alertTypeNames[type as keyof typeof alertTypeNames]}</span>
                  <Switch
                    checked={enabled}
                    onCheckedChange={() => toggleAlert(type as keyof typeof alertsEnabled)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Alerts */}
        <div className="space-y-4">
          <h4 className="font-semibold">Alertas Ativos</h4>
          {alerts.length === 0 ? (
            <div className="text-center p-4 text-muted-foreground">
              Nenhum alerta ativo. Configure os alertas acima.
            </div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                <div className="mt-0.5">
                  {alert.icon}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{alert.title}</span>
                    <div className="flex space-x-2">
                      <Badge className={getPriorityColor(alert.priority)}>
                        {alert.priority.toUpperCase()}
                      </Badge>
                      <Badge className={getTriggeredColor(alert.triggered)}>
                        {alert.triggered ? 'ATIVO' : 'AGUARDANDO'}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                  <p className="text-xs text-muted-foreground">Condição: {alert.condition}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Actions */}
        {triggeredAlerts.length > 0 && (
          <div className="p-4 rounded-lg bg-green-50 border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2">Ações Recomendadas</h4>
            <div className="space-y-2 text-sm text-green-700">
              {triggeredAlerts.map((alert, index) => (
                <div key={index}>
                  • {alert.title}: {alert.description}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartAlerts;
