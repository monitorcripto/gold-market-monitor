
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface RiskWarningProps {
  className?: string;
}

const RiskWarning = ({ className = "" }: RiskWarningProps) => {
  return (
    <Alert className={`border-orange-200 bg-orange-50 ${className}`}>
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-orange-800">
        <div className="font-semibold mb-1">⚠️ Aviso de Risco</div>
        <div className="text-sm">
          Esta é uma análise automatizada baseada em indicadores técnicos e não constitui aconselhamento financeiro. 
          Sempre faça sua própria pesquisa e considere consultar um consultor financeiro qualificado.
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default RiskWarning;
