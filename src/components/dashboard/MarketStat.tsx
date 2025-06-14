
interface MarketStatProps {
  label: string;
  value: React.ReactNode;
}

const MarketStat = ({ label, value }: MarketStatProps) => (
  <div className="flex justify-between items-center">
    <span className="text-muted-foreground text-sm">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default MarketStat;
