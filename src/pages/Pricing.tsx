
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";

const pricingPlans = [
  {
    id: "free",
    name: "Gratuito",
    description: "Acesso básico para monitoramento de criptomoedas.",
    price: "0",
    features: [
      "Monitoramento de 5 criptomoedas",
      "Dados atualizados a cada 5 minutos",
      "Gráficos básicos",
      "1 alerta de preço"
    ],
    color: "crypto-gray",
    highlight: false,
  },
  {
    id: "basic",
    name: "Básico",
    description: "Para investidores que buscam recursos avançados.",
    price: "29,90",
    features: [
      "Monitoramento de 20 criptomoedas",
      "Dados atualizados a cada minuto",
      "Gráficos com indicadores técnicos",
      "10 alertas de preço",
      "Acesso a histórico de 6 meses"
    ],
    color: "crypto-green",
    highlight: true,
  },
  {
    id: "premium",
    name: "Premium",
    description: "Para traders profissionais e investidores sérios.",
    price: "79,90",
    features: [
      "Monitoramento ilimitado de criptomoedas",
      "Dados em tempo real",
      "Análise técnica avançada",
      "Alertas ilimitados",
      "Histórico completo",
      "API privada",
      "Suporte prioritário"
    ],
    color: "crypto-gold",
    highlight: false,
  },
];

const Pricing = () => {
  const { isAuthenticated, user } = useAuth();

  const handleSubscribe = (planId: string) => {
    if (!isAuthenticated) {
      toast.error("Você precisa estar logado para assinar um plano", {
        description: "Faça login ou crie uma conta para continuar",
      });
      return;
    }

    // This would connect to a subscription API
    toast.success(`Você selecionou o plano ${planId}`, {
      description: "Redirecionando para o pagamento...",
    });
    
    // Mock implementation - would redirect to Stripe
    setTimeout(() => {
      toast.info("Funcionalidade de pagamento ainda em implementação", {
        description: "Esta é uma versão de demonstração",
      });
    }, 2000);
  };

  return (
    <div className="container px-4 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">Planos e Preços</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Escolha o plano ideal para suas necessidades de monitoramento de criptomoedas.
          Todos os planos incluem acesso ao dashboard principal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricingPlans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative border-2 ${
              plan.highlight
                ? `border-${plan.color}-500 shadow-lg`
                : "border-border"
            }`}
          >
            {plan.highlight && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className={`bg-${plan.color}-500 text-white text-xs font-medium px-3 py-1 rounded-full`}>
                  Mais Popular
                </span>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <span className={`text-4xl font-bold ${plan.highlight ? `text-${plan.color}-500` : ""}`}>
                  R$ {plan.price}
                </span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <div className="space-y-3">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start">
                    <div className={`rounded-full p-1 ${
                      plan.highlight ? `bg-${plan.color}-100 text-${plan.color}-700` : "bg-muted"
                    }`}>
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm text-muted-foreground ml-2">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleSubscribe(plan.id)}
                className={`w-full ${
                  plan.highlight
                    ? `bg-${plan.color}-500 hover:bg-${plan.color}-600`
                    : ""
                }`}
                variant={plan.highlight ? "default" : "outline"}
              >
                {plan.id === "free" ? "Começar Grátis" : "Assinar Plano"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h3 className="text-xl font-medium mb-3">Tem dúvidas?</h3>
        <p className="text-muted-foreground mb-6">
          Entre em contato com nossa equipe de suporte para obter mais informações sobre nossos planos.
        </p>
        <Button variant="outline">Entrar em Contato</Button>
      </div>
    </div>
  );
};

export default Pricing;
