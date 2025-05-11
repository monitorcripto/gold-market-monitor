
import { useMemo } from "react";
import { CryptoChartData, useCrypto } from "@/context/CryptoContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import TrendIndicator from "./TrendIndicator";

interface ChartData {
  date: string;
  time: string;
  price: number;
  timestamp: number;
}

const timeframeOptions: { value: '1d' | '7d' | '30d' | '90d'; label: string }[] = [
  { value: "1d", label: "1D" },
  { value: "7d", label: "1S" },
  { value: "30d", label: "1M" },
  { value: "90d", label: "3M" },
];

const CryptoChart = () => {
  const { selectedCrypto, chartData, chartTimeframe, setChartTimeframe } = useCrypto();

  const formattedData = useMemo(() => {
    if (!chartData?.prices?.length) return [];

    return chartData.prices.map(([timestamp, price]) => {
      const date = new Date(timestamp);
      return {
        timestamp,
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        price,
      };
    });
  }, [chartData]);

  const calculateTrend = (data: ChartData[]): "up" | "down" | null => {
    if (data.length < 2) return null;
    
    const firstPrice = data[0].price;
    const lastPrice = data[data.length - 1].price;
    
    return lastPrice > firstPrice ? "up" : "down";
  };

  const trend = calculateTrend(formattedData);
  const priceChangePercent = useMemo(() => {
    if (formattedData.length < 2) return 0;
    
    const firstPrice = formattedData[0].price;
    const lastPrice = formattedData[formattedData.length - 1].price;
    
    return ((lastPrice - firstPrice) / firstPrice) * 100;
  }, [formattedData]);

  return (
    <Card className="col-span-1 lg:col-span-2 crypto-chart">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-medium">
              {selectedCrypto ? selectedCrypto.name : "Selecione uma criptomoeda"}
              {selectedCrypto && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({selectedCrypto.symbol.toUpperCase()})
                </span>
              )}
            </CardTitle>
            {selectedCrypto && (
              <div className="flex items-center mt-1">
                <span className="text-2xl font-bold mr-3">
                  {formatCurrency(selectedCrypto.current_price)}
                </span>
                <TrendIndicator 
                  value={priceChangePercent} 
                  asPercentage 
                  showIcon
                />
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            {timeframeOptions.map((option) => (
              <Button
                key={option.value}
                variant={chartTimeframe === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setChartTimeframe(option.value)}
                className={chartTimeframe === option.value ? "bg-crypto-green-500 hover:bg-crypto-green-600" : ""}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          {formattedData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={formattedData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={trend === "up" ? "#4CAF50" : "#F44336"}
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="95%"
                      stopColor={trend === "up" ? "#4CAF50" : "#F44336"}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                <XAxis
                  dataKey={(chartTimeframe === "1d" || chartTimeframe === "7d") ? "time" : "date"}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={50}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "Preço"]}
                  labelFormatter={(label) => `${formattedData[label]?.date} ${formattedData[label]?.time}`}
                  contentStyle={{
                    borderRadius: "8px",
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={trend === "up" ? "#4CAF50" : "#F44336"}
                  fill="url(#colorPrice)"
                  strokeWidth={2}
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">Sem dados disponíveis</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoChart;
