
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminLogs } from "@/hooks/useAdminLogs";
import AdminLogsFilters from "./AdminLogsFilters";
import AdminLogsTable from "./AdminLogsTable";

const AdminLogs = () => {
  const { logs, loading } = useAdminLogs();
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

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
        <AdminLogsFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          actionFilter={actionFilter}
          onActionFilterChange={setActionFilter}
        />
        <AdminLogsTable logs={filteredLogs} />
      </CardContent>
    </Card>
  );
};

export default AdminLogs;
