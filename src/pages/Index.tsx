
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FearGreedIndex from "@/components/FearGreedIndex";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleAccessDashboard = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      toast.error("É necessário fazer login para acessar o dashboard completo", {
        description: "Faça login ou crie uma conta para continuar"
      });
    }
  };

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

  const handleSubscribe = (planId: string) => {
    if (!isAuthenticated) {
      toast.error("Você precisa estar logado para assinar um plano", {
        description: "Faça login ou crie uma conta para continuar",
      });
      return;
    }

    toast.success(`Você selecionou o plano ${planId}`, {
      description: "Redirecionando para o pagamento...",
    });
    
    setTimeout(() => {
      toast.info("Funcionalidade de pagamento ainda em implementação", {
        description: "Esta é uma versão de demonstração",
      });
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="container px-4 py-8 flex-grow max-w-7xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Monitor Cripto</h1>
            <p className="text-muted-foreground">
              Monitore preços, tendências e indicadores em tempo real
            </p>
          </div>
          <Button 
            onClick={handleAccessDashboard}
            className="mt-4 lg:mt-0"
          >
            {isAuthenticated ? "Acessar Dashboard" : "Fazer Login para Acessar"}
          </Button>
        </div>
        
        {/* Fear & Greed Index Section */}
        <section className="mt-8">
          <Card className="overflow-hidden">
            <CardHeader className="pb-0">
              <CardTitle className="text-2xl">Índice do Medo e Ganância</CardTitle>
              <CardDescription>
                Um indicador importante para entender o sentimento atual do mercado
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <FearGreedIndex />
              
              <div className="mt-8 flex justify-center">
                <Button 
                  onClick={handleAccessDashboard}
                  size="lg"
                  className="bg-gradient-to-r from-crypto-green-500 to-crypto-gold-500 hover:from-crypto-green-600 hover:to-crypto-gold-600"
                >
                  Ver Análise Completa de Mercado
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
        
        {/* Value proposition section */}
        <section className="mt-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Tome decisões mais inteligentes com dados em tempo real</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
            Nossa plataforma fornece análises avançadas, indicadores técnicos e alertas personalizados 
            para ajudar você a maximizar seus investimentos em criptomoedas.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Dados em Tempo Real</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Acompanhe as flutuações do mercado com atualizações constantes e alertas personalizados.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Análise Técnica</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Indicadores avançados e ferramentas para análise detalhada do comportamento dos preços.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Alertas Inteligentes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Configurações personalizadas para notificações sobre movimentações importantes do mercado.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Pricing section */}
        <section className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Planos e Preços</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Escolha o plano ideal para suas necessidades de monitoramento de criptomoedas.
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
                  <div className="pt-4">
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      
      <footer className="border-t border-border py-6 bg-background">
        <div className="container px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="font-bold text-lg bg-gradient-to-r from-crypto-green-500 to-crypto-gold-500 bg-clip-text text-transparent">
                Monitor Cripto
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                © {new Date().getFullYear()} Monitor Cripto. Todos os direitos reservados.
              </p>
            </div>
            <div className="flex space-x-4 text-sm">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Termos de Uso
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Política de Privacidade
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Contato
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
