
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface AdminLogsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  actionFilter: string;
  onActionFilterChange: (value: string) => void;
}

const AdminLogsFilters = ({
  searchTerm,
  onSearchChange,
  actionFilter,
  onActionFilterChange
}: AdminLogsFiltersProps) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar logs..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={actionFilter} onValueChange={onActionFilterChange}>
        <SelectTrigger className="w-48">
          <Filter className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Filtrar por ação" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as ações</SelectItem>
          <SelectItem value="CREATE_USER">Criar Usuário</SelectItem>
          <SelectItem value="UPDATE_USER">Atualizar Usuário</SelectItem>
          <SelectItem value="DELETE_USER">Deletar Usuário</SelectItem>
          <SelectItem value="UPDATE_SUBSCRIPTION">Atualizar Plano</SelectItem>
          <SelectItem value="RESET_PASSWORD">Resetar Senha</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default AdminLogsFilters;
