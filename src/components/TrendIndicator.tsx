
import { ArrowUp, ArrowDown } from "lucide-react";

interface TrendIndicatorProps {
  value: number;
  asPercentage?: boolean;
  showIcon?: boolean;
  className?: string;
}

const TrendIndicator = ({
  value,
  asPercentage = false,
  showIcon = true,
  className = "",
}: TrendIndicatorProps) => {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  
  const formattedValue = asPercentage
    ? `${Math.abs(value).toFixed(2)}%`
    : Math.abs(value).toFixed(2);

  return (
    <div
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-sm ${
        isNeutral
          ? "bg-crypto-gray-100 text-crypto-gray-500"
          : isPositive
          ? "bg-crypto-green-100 text-crypto-green-600"
          : "bg-crypto-red-100 text-crypto-red-600"
      } ${className}`}
    >
      {showIcon && !isNeutral && (
        isPositive ? (
          <ArrowUp className="w-3 h-3 mr-1" />
        ) : (
          <ArrowDown className="w-3 h-3 mr-1" />
        )
      )}
      <span>{formattedValue}</span>
    </div>
  );
};

export default TrendIndicator;
