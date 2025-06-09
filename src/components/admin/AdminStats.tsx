
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, AlertTriangle, TrendingUp } from "lucide-react";

interface Stats {
  totalUsers: number;
  activeUsers: number;
  overdueUsers: number;
  cancelledUsers: number;
  freeUsers: number;
  basicUsers: number;
  premiumUsers: number;
  monthlyRevenue: number;
}

const AdminStats = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeUsers: 0,
    overdueUsers: 0,
    cancelledUsers: 0,
    freeUsers: 0,
    basicUsers: 0,
    premiumUsers: 0,
    monthlyRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const { data: users, error } = await supabase
        .from('profiles')
        .select('subscription_tier, payment_status');

      if (error) throw error;

      const totalUsers = users?.length || 0;
      const activeUsers = users?.filter(u => u.payment_status === 'active').length || 0;
      const overdueUsers = users?.filter(u => u.payment_status === 'overdue').length || 0;
      const cancelledUsers = users?.filter(u => u.payment_status === 'cancelled').length || 0;
      
      const freeUsers = users?.filter(u => u.subscription_tier === 'free').length || 0;
      const basicUsers = users?.filter(u => u.subscription_tier === 'basic').length || 0;
      const premiumUsers = users?.filter(u => u.subscription_tier === 'premium').length || 0;

      // Calculate monthly revenue (simplified calculation)
      const monthlyRevenue = (basicUsers * 29.90) + (premiumUsers * 79.90);

      setStats({
        totalUsers,
        activeUsers,
        overdueUsers,
        cancelledUsers,
        freeUsers,
        basicUsers,
        premiumUsers,
        monthlyRevenue
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center p-8">Carregando estatísticas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Todos os usuários registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              Com pagamento em dia
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Débito</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdueUsers}</div>
            <p className="text-xs text-muted-foreground">
              Pagamentos atrasados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {stats.monthlyRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Estimativa baseada nos planos ativos
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Planos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Gratuito</span>
                <span className="font-medium">{stats.freeUsers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Básico</span>
                <span className="font-medium">{stats.basicUsers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Premium</span>
                <span className="font-medium">{stats.premiumUsers}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status de Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Ativos</span>
                <span className="font-medium text-green-600">{stats.activeUsers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Em Débito</span>
                <span className="font-medium text-red-600">{stats.overdueUsers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Cancelados</span>
                <span className="font-medium text-gray-600">{stats.cancelledUsers}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taxa de Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Gratuito → Pago</span>
                <span className="font-medium">
                  {stats.totalUsers > 0 ? 
                    (((stats.basicUsers + stats.premiumUsers) / stats.totalUsers) * 100).toFixed(1) : 0
                  }%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Básico → Premium</span>
                <span className="font-medium">
                  {stats.basicUsers > 0 ? 
                    ((stats.premiumUsers / (stats.basicUsers + stats.premiumUsers)) * 100).toFixed(1) : 0
                  }%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminStats;
