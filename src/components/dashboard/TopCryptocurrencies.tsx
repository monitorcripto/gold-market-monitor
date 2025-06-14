
import { Skeleton } from "@/components/ui/skeleton";
import CryptoCard from "@/components/CryptoCard";
import { CryptoData } from "@/context/CryptoContext";

interface TopCryptocurrenciesProps {
  cryptoData: CryptoData[];
  isLoading: boolean;
  selectedCrypto: CryptoData | null;
  onCryptoSelect: (crypto: CryptoData) => void;
}

const TopCryptocurrencies = ({ 
  cryptoData, 
  isLoading, 
  selectedCrypto, 
  onCryptoSelect 
}: TopCryptocurrenciesProps) => {
  const topCryptos = cryptoData.slice(0, 5);

  return (
    <section className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Top Criptomoedas</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {isLoading ? (
          Array(5).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))
        ) : (
          topCryptos.map((crypto) => (
            <CryptoCard
              key={crypto.id}
              crypto={crypto}
              isSelected={selectedCrypto?.id === crypto.id}
              onClick={() => onCryptoSelect(crypto)}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default TopCryptocurrencies;
