
import { Skeleton } from "@/components/ui/skeleton";
import { useFearGreedData } from "@/hooks/useFearGreedData";
import { FearGreedHeader } from "./feargreed/FearGreedHeader";
import { FearGreedSentimentAlert } from "./feargreed/FearGreedSentimentAlert";
import { FearGreedThermometer } from "./feargreed/FearGreedThermometer";
import { FearGreedInfoCard } from "./feargreed/FearGreedInfoCard";

const FearGreedIndex = () => {
  const {
    fearGreedData,
    previousValue,
    loading,
    error,
    isRefreshing,
    fetchFearGreedIndex,
    getFormattedLastUpdate
  } = useFearGreedData();

  if (loading && !fearGreedData) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-6 w-40" />
      </div>
    );
  }
  
  if (error && !fearGreedData) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md">
        <p className="font-medium">Erro ao carregar o índice do medo e ganância</p>
        <p className="text-sm mt-1">{error}</p>
        <button 
          onClick={() => fetchFearGreedIndex()}
          className="mt-2 text-sm underline hover:no-underline"
        >
          Tentar novamente
        </button>
      </div>
    );
  }
  
  if (!fearGreedData) return null;

  return (
    <div className="space-y-6">
      <FearGreedHeader
        fearGreedData={fearGreedData}
        previousValue={previousValue}
        isRefreshing={isRefreshing}
        error={error}
        onRefresh={() => fetchFearGreedIndex(true)}
        getFormattedLastUpdate={getFormattedLastUpdate}
      />

      <FearGreedSentimentAlert value={fearGreedData.value} />
      
      <FearGreedThermometer value={fearGreedData.value} />
      
      <FearGreedInfoCard 
        fearGreedData={fearGreedData} 
        previousValue={previousValue} 
      />
    </div>
  );
};

export default FearGreedIndex;
