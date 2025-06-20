
import InfoTooltip from "@/components/InfoTooltip";

interface MarketStatProps {
  label: string;
  value: React.ReactNode;
  tooltip?: string;
}

const MarketStat = ({ label, value, tooltip }: MarketStatProps) => (
  <div className="flex justify-between items-center">
    <div className="flex items-center space-x-1">
      <span className="text-muted-foreground text-sm">{label}</span>
      {tooltip && <InfoTooltip content={tooltip} />}
    </div>
    <span className="font-medium">{value}</span>
  </div>
);

export default MarketStat;
