
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AdminLog } from "@/types/adminLogs";
import { getActionBadge, formatActionType } from "@/utils/adminLogsUtils";

interface AdminLogsTableProps {
  logs: AdminLog[];
}

const AdminLogsTable = ({ logs }: AdminLogsTableProps) => {
  if (logs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum log encontrado
      </div>
    );
  }

  return (
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
          {logs.map((log) => (
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
  );
};

export default AdminLogsTable;
