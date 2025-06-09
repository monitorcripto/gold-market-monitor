
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";
import { Edit, DollarSign } from "lucide-react";

interface SubscriptionPlan {
  id: string;
  tier: "free" | "basic" | "premium";
  name: string;
  price: number;
  currency: string;
  crypto_limit?: number;
  update_frequency_minutes: number;
  alerts_limit?: number;
  history_months?: number;
  has_technical_indicators: boolean;
  has_api_access: boolean;
  has_priority_support: boolean;
  description?: string;
}

const SubscriptionManagement = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('price', { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error("Erro ao carregar planos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const updatePlan = async (planId: string, updates: Partial<SubscriptionPlan>) => {
    try {
      const { error } = await supabase
        .from('subscription_plans')
        .update(updates)
        .eq('id', planId);

      if (error) throw error;

      toast.success("Plano atualizado com sucesso");
      fetchPlans();
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating plan:', error);
      toast.error("Erro ao atualizar plano");
    }
  };

  const getTierBadge = (tier: string) => {
    const colors = {
      free: "bg-gray-100 text-gray-800",
      basic: "bg-blue-100 text-blue-800",
      premium: "bg-purple-100 text-purple-800"
    };
    return colors[tier as keyof typeof colors] || colors.free;
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Carregando planos...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Gestão de Planos de Assinatura</CardTitle>
          <DollarSign className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plano</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Características</TableHead>
                <TableHead>Recursos</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{plan.name}</div>
                      <Badge className={getTierBadge(plan.tier)}>
                        {plan.tier}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      R$ {plan.price.toFixed(2)}/{plan.currency === 'BRL' ? 'mês' : 'month'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm space-y-1">
                      <div>Criptos: {plan.crypto_limit || 'Ilimitado'}</div>
                      <div>Atualização: {plan.update_frequency_minutes}min</div>
                      <div>Alertas: {plan.alerts_limit || 'Ilimitado'}</div>
                      <div>Histórico: {plan.history_months || 'Completo'} meses</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {plan.has_technical_indicators && (
                        <Badge variant="secondary">Indicadores Técnicos</Badge>
                      )}
                      {plan.has_api_access && (
                        <Badge variant="secondary">API Privada</Badge>
                      )}
                      {plan.has_priority_support && (
                        <Badge variant="secondary">Suporte Prioritário</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedPlan(plan);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Plano de Assinatura</DialogTitle>
            </DialogHeader>
            {selectedPlan && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome do Plano</Label>
                    <Input
                      id="name"
                      defaultValue={selectedPlan.name}
                      onChange={(e) => setSelectedPlan({...selectedPlan, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Preço (R$)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      defaultValue={selectedPlan.price}
                      onChange={(e) => setSelectedPlan({...selectedPlan, price: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="crypto_limit">Limite de Criptomoedas</Label>
                    <Input
                      id="crypto_limit"
                      type="number"
                      placeholder="Deixe vazio para ilimitado"
                      defaultValue={selectedPlan.crypto_limit || ""}
                      onChange={(e) => setSelectedPlan({
                        ...selectedPlan, 
                        crypto_limit: e.target.value ? parseInt(e.target.value) : undefined
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="alerts_limit">Limite de Alertas</Label>
                    <Input
                      id="alerts_limit"
                      type="number"
                      placeholder="Deixe vazio para ilimitado"
                      defaultValue={selectedPlan.alerts_limit || ""}
                      onChange={(e) => setSelectedPlan({
                        ...selectedPlan, 
                        alerts_limit: e.target.value ? parseInt(e.target.value) : undefined
                      })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="update_frequency">Frequência de Atualização (min)</Label>
                    <Input
                      id="update_frequency"
                      type="number"
                      defaultValue={selectedPlan.update_frequency_minutes}
                      onChange={(e) => setSelectedPlan({
                        ...selectedPlan, 
                        update_frequency_minutes: parseInt(e.target.value)
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="history_months">Histórico (meses)</Label>
                    <Input
                      id="history_months"
                      type="number"
                      placeholder="Deixe vazio para completo"
                      defaultValue={selectedPlan.history_months || ""}
                      onChange={(e) => setSelectedPlan({
                        ...selectedPlan, 
                        history_months: e.target.value ? parseInt(e.target.value) : undefined
                      })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    defaultValue={selectedPlan.description || ""}
                    onChange={(e) => setSelectedPlan({...selectedPlan, description: e.target.value})}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="technical_indicators">Indicadores Técnicos</Label>
                    <Switch
                      id="technical_indicators"
                      checked={selectedPlan.has_technical_indicators}
                      onCheckedChange={(checked) => setSelectedPlan({
                        ...selectedPlan, 
                        has_technical_indicators: checked
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="api_access">Acesso à API</Label>
                    <Switch
                      id="api_access"
                      checked={selectedPlan.has_api_access}
                      onCheckedChange={(checked) => setSelectedPlan({
                        ...selectedPlan, 
                        has_api_access: checked
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="priority_support">Suporte Prioritário</Label>
                    <Switch
                      id="priority_support"
                      checked={selectedPlan.has_priority_support}
                      onCheckedChange={(checked) => setSelectedPlan({
                        ...selectedPlan, 
                        has_priority_support: checked
                      })}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => updatePlan(selectedPlan.id, selectedPlan)}>
                    Salvar Alterações
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default SubscriptionManagement;
