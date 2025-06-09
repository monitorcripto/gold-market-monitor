
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface AdminLog {
  id: string;
  admin_id: string | null;
  action_type: string;
  target_user_id?: string | null;
  details?: any;
  ip_address?: string | null;
  created_at: string;
  admin_email?: string;
  target_email?: string;
}

const AdminLogs = () => {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const fetchLogs = async () => {
    try {
      // First get the logs
      const { data: logsData, error: logsError } = await supabase
        .from('admin_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (logsError) throw logsError;

      // Then get admin and target user emails separately
      const adminIds = [...new Set(logsData?.map(log => log.admin_id).filter(Boolean) as string[])];
      const targetIds = [...new Set(logsData?.map(log => log.target_user_id).filter(Boolean) as string[])];
      
      const [adminProfiles, targetProfiles] = await Promise.all([
        adminIds.length > 0 ? supabase
          .from('profiles')
          .select('id, email')
          .in('id', adminIds) : Promise.resolve({ data: [] }),
        targetIds.length > 0 ? supabase
          .from('profiles')
          .select('id, email')
          .in('id', targetIds) : Promise.resolve({ data: [] })
      ]);

      // Create lookup maps with proper typing
      const adminEmailMap = new Map<string, string>();
      const targetEmailMap = new Map<string, string>();

      adminProfiles.data?.forEach(profile => {
        if (profile.id && profile.email) {
          adminEmailMap.set(profile.id, profile.email);
        }
      });

      targetProfiles.data?.forEach(profile => {
        if (profile.id && profile.email) {
          targetEmailMap.set(profile.id, profile.email);
        }
      });

      // Combine the data
      const formattedLogs: AdminLog[] = logsData?.map(log => ({
        ...log,
        ip_address: log.ip_address ? String(log.ip_address) : null,
        admin_email: log.admin_id ? adminEmailMap.get(log.admin_id) : undefined,
        target_email: log.target_user_id ? targetEmailMap.get(log.target_user_id) : undefined
      })) || [];

      setLogs(formattedLogs);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getActionBadge = (action: string) => {
    const colors = {
      'CREATE_USER': 'bg-green-100 text-green-800',
      'UPDATE_USER': 'bg-blue-100 text-blue-800',
      'DELETE_USER': 'bg-red-100 text-red-800',
      'UPDATE_SUBSCRIPTION': 'bg-purple-100 text-purple-800',
      'RESET_PASSWORD': 'bg-yellow-100 text-yellow-800'
    };
    return colors[action as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatActionType = (action: string) => {
    const actions = {
      'CREATE_USER': 'Criar Usuário',
      'UPDATE_USER': 'Atualizar Usuário',
      'DELETE_USER': 'Deletar Usuário',
      'UPDATE_SUBSCRIPTION': 'Atualizar Plano',
      'RESET_PASSWORD': 'Resetar Senha'
    };
    return actions[action as keyof typeof actions] || action;
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.admin_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.target_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = actionFilter === "all" || log.action_type === actionFilter;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <div className="flex items-center justify-center p-8">Carregando logs...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logs de Auditoria</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={actionFilter} onValueChange={setActionFilter}>
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

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Administrador</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Usuário Alvo</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    {new Date(log.created_at).toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    {log.admin_email || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge className={getActionBadge(log.action_type)}>
                      {formatActionType(log.action_type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {log.target_email || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {log.ip_address || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">
                      {log.details ? JSON.stringify(log.details) : 'N/A'}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum log encontrado
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminLogs;
