
import { Progress } from "@/components/ui/progress";
import { getColorByValue } from "@/utils/fearGreedUtils";

interface FearGreedThermometerProps {
  value: number;
}

export const FearGreedThermometer = ({ value }: FearGreedThermometerProps) => {
  return (
    <div className="relative pt-6 pb-12">
      <div className="relative">
        <Progress 
          value={value} 
          className="h-6 bg-muted"
        />
        <div 
          className={`absolute top-0 left-0 h-6 rounded-full transition-all duration-500 ${getColorByValue(value)}`}
          style={{ width: `${value}%` }}
        />
        
        <div 
          className="absolute top-0 w-1 h-6 bg-foreground/80 transition-all duration-500"
          style={{ left: `${value}%`, transform: 'translateX(-50%)' }}
        />
      </div>
      
      <div className="flex justify-between text-xs mt-2 text-muted-foreground">
        <div className="text-red-600 font-medium">Medo Extremo</div>
        <div>Medo</div>
        <div>Neutro</div>
        <div>Ganância</div>
        <div className="text-green-700 font-medium">Ganância Extrema</div>
      </div>
      
      <div className="absolute -bottom-1 left-0 w-full flex justify-between px-0">
        {[0, 25, 50, 75, 100].map((mark) => (
          <div key={mark} className="flex flex-col items-center">
            <div className="h-3 w-0.5 bg-muted-foreground" />
            <span className="text-xs text-muted-foreground mt-1">{mark}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
