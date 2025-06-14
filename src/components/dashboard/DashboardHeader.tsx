
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  refreshing: boolean;
  onRefresh: () => void;
}

const DashboardHeader = ({ refreshing, onRefresh }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">Centro de Análise Cripto</h1>
        <p className="text-muted-foreground">
          Análise completa com indicadores técnicos, sinais de trading e gestão de risco
        </p>
      </div>
      <Button 
        onClick={onRefresh}
        disabled={refreshing}
        className="mt-4 lg:mt-0"
      >
        {refreshing ? "Atualizando..." : "Atualizar Dados"}
      </Button>
    </div>
  );
};

export default DashboardHeader;
