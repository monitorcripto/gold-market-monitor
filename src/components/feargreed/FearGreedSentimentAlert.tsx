
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getMarketSentiment } from "@/utils/fearGreedUtils";

interface FearGreedSentimentAlertProps {
  value: number;
}

export const FearGreedSentimentAlert = ({ value }: FearGreedSentimentAlertProps) => {
  if (value > 25 && value < 75) return null;

  const sentiment = getMarketSentiment(value);

  return (
    <Alert className={value <= 25 ? "border-red-200 bg-red-50" : "border-orange-200 bg-orange-50"}>
      <div className="flex items-center gap-2">
        {sentiment.icon}
        <AlertDescription>
          <span className="font-semibold">{sentiment.text}:</span> {sentiment.description}
        </AlertDescription>
      </div>
    </Alert>
  );
};
