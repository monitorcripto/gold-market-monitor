import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import TrendIndicator from "@/components/TrendIndicator";
import { CryptoData } from "@/context/CryptoContext";
import { formatCurrency } from "@/lib/utils";
import RiskWarning from "@/components/RiskWarning";

interface AllCryptocurrenciesSectionProps {
  cryptoData: CryptoData[];
  isLoading: boolean;
  onCryptoSelect: (crypto: CryptoData) => void;
}

const AllCryptocurrenciesSection = ({ 
  cryptoData, 
  isLoading, 
  onCryptoSelect 
}: AllCryptocurrenciesSectionProps) => {
  const allCryptos = cryptoData.slice(0, 20);

  const CryptoTable = ({ data }: { data: CryptoData[] }) => (
    <div className="bg-card rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted">
              <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-8">#</th>
              <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Nome</th>
              <th className="p-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Preço</th>
              <th className="p-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">24h %</th>
              <th className="p-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Cap. de Mercado</th>
              <th className="p-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Volume</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array(10).fill(0).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  <td colSpan={6} className="p-3">
                    <Skeleton className="h-6 w-full" />
                  </td>
                </tr>
              ))
            ) : (
              data.map((crypto) => (
                <tr 
                  key={crypto.id} 
                  className="border-b border-border hover:bg-muted/50 cursor-pointer"
                  onClick={() => onCryptoSelect(crypto)}
                >
                  <td className="p-4 whitespace-nowrap">{crypto.market_cap_rank}</td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img src={crypto.image} alt={crypto.name} className="w-6 h-6 mr-3" />
                      <div>
                        <div className="font-medium">{crypto.name}</div>
                        <div className="text-xs text-muted-foreground uppercase">{crypto.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right whitespace-nowrap font-medium">
                    {formatCurrency(crypto.current_price)}
                  </td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <TrendIndicator
                      value={crypto.price_change_percentage_24h}
                      asPercentage
                      showIcon
                    />
                  </td>
                  <td className="p-4 text-right whitespace-nowrap">
                    {formatCurrency(crypto.market_cap)}
                  </td>
                  <td className="p-4 text-right whitespace-nowrap">
                    {formatCurrency(crypto.total_volume)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <section className="mt-8">
      <Tabs defaultValue="all" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Todas as Criptomoedas</h2>
          <TabsList>
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="gainers">Em Alta</TabsTrigger>
            <TabsTrigger value="losers">Em Baixa</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="space-y-4">
          <CryptoTable data={allCryptos} />
          <RiskWarning />
        </TabsContent>
        
        <TabsContent value="gainers" className="space-y-4">
          <CryptoTable 
            data={cryptoData
              .filter(crypto => crypto.price_change_percentage_24h > 0)
              .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
              .slice(0, 10)
            }
          />
          <RiskWarning />
        </TabsContent>
        
        <TabsContent value="losers" className="space-y-4">
          <CryptoTable 
            data={cryptoData
              .filter(crypto => crypto.price_change_percentage_24h < 0)
              .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
              .slice(0, 10)
            }
          />
          <RiskWarning />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default AllCryptocurrenciesSection;
