
import { CryptoData } from "@/context/CryptoContext";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface CryptoCardProps {
  crypto: CryptoData;
  isSelected?: boolean;
  onClick?: () => void;
}

const CryptoCard = ({ crypto, isSelected, onClick }: CryptoCardProps) => {
  const priceChangeIs24h = crypto.price_change_percentage_24h;
  const isPriceUp = priceChangeIs24h > 0;

  return (
    <Card 
      className={`crypto-card cursor-pointer hover:border-crypto-green-300 transition-all ${
        isSelected ? "border-2 border-crypto-green-500" : ""
      }`} 
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center">
            <img 
              src={crypto.image} 
              alt={crypto.name} 
              className="w-8 h-8 mr-3 flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-sm truncate">{crypto.name}</h3>
              <p className="text-xs text-muted-foreground uppercase">{crypto.symbol}</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="font-medium text-sm">{formatCurrency(crypto.current_price)}</p>
            <div className={`flex items-center justify-end text-xs ${
              isPriceUp ? "text-crypto-green-500" : "text-crypto-red-500"
            }`}>
              {isPriceUp ? (
                <ArrowUp className="w-3 h-3 mr-1" />
              ) : (
                <ArrowDown className="w-3 h-3 mr-1" />
              )}
              <span>{Math.abs(priceChangeIs24h).toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoCard;
