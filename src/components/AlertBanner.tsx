
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { useCrypto, CryptoData } from "@/context/CryptoContext";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Simulated alert type
interface TrendAlert {
  id: string;
  cryptoId: string;
  cryptoName: string;
  type: 'bullish' | 'bearish';
  message: string;
  timestamp: number;
}

const AlertBanner = () => {
  const { cryptoData } = useCrypto();
  const [alerts, setAlerts] = useState<TrendAlert[]>([]);
  const [visibleAlerts, setVisibleAlerts] = useState<TrendAlert[]>([]);
  
  // Simulated trend change detection
  useEffect(() => {
    // This would normally be a more sophisticated algorithm checking indicators
    if (cryptoData.length === 0) return;
    
    const checkForTrendChanges = () => {
      // For demonstration, randomly create alerts for some cryptocurrencies
      cryptoData.slice(0, 5).forEach(crypto => {
        const shouldCreateAlert = Math.random() > 0.95; // 5% chance
        
        if (shouldCreateAlert) {
          const isBullish = crypto.price_change_percentage_24h > 0;
          
          const newAlert: TrendAlert = {
            id: `alert-${Date.now()}-${crypto.id}`,
            cryptoId: crypto.id,
            cryptoName: crypto.name,
            type: isBullish ? 'bullish' : 'bearish',
            message: isBullish 
              ? `${crypto.name} mostra sinais de tendência de alta. RSI acima de 70.` 
              : `${crypto.name} mostra sinais de tendência de baixa. RSI abaixo de 30.`,
            timestamp: Date.now()
          };
          
          setAlerts(prev => [newAlert, ...prev].slice(0, 10)); // Keep last 10 alerts
          
          // Show toast notification
          toast(newAlert.message, {
            description: `${new Date(newAlert.timestamp).toLocaleTimeString()}`,
            action: {
              label: "Ver",
              onClick: () => {
                // This would navigate to the specific crypto details
                console.log(`Navigate to ${crypto.id}`);
              },
            },
          });
        }
      });
    };
    
    // Check for trend changes every 30 seconds
    const interval = setInterval(checkForTrendChanges, 30000);
    return () => clearInterval(interval);
  }, [cryptoData]);
  
  // Control which alerts are displayed in UI
  useEffect(() => {
    // Only show most recent 3 alerts in the UI
    setVisibleAlerts(alerts.slice(0, 1));
  }, [alerts]);
  
  const dismissAlert = (alertId: string) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };
  
  if (visibleAlerts.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-3">
      {visibleAlerts.map(alert => (
        <Alert 
          key={alert.id} 
          className={
            alert.type === 'bullish' 
              ? "border-l-4 border-crypto-green-500 bg-crypto-green-50" 
              : "border-l-4 border-crypto-red-500 bg-crypto-red-50"
          }
        >
          <div className="flex justify-between items-start">
            <div>
              <AlertTitle className={
                alert.type === 'bullish' 
                  ? "text-crypto-green-700" 
                  : "text-crypto-red-700"
              }>
                {alert.type === 'bullish' ? 'Tendência de Alta' : 'Tendência de Baixa'}
              </AlertTitle>
              <AlertDescription className="mt-1">
                {alert.message}
                <div className="text-xs text-muted-foreground mt-1">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </div>
              </AlertDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 rounded-full" 
              onClick={() => dismissAlert(alert.id)}
            >
              <X className="h-3.5 w-3.5" />
              <span className="sr-only">Fechar</span>
            </Button>
          </div>
        </Alert>
      ))}
    </div>
  );
};

export default AlertBanner;
