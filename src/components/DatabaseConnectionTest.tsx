
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

const DatabaseConnectionTest = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    try {
      // Teste simples - consulta a versão do PostgreSQL
      const { data, error } = await supabase.rpc('get_postgresql_version');
      
      if (error) {
        console.error("Erro de conexão:", error);
        setIsConnected(false);
        toast.error("Falha na conexão com o banco de dados");
        return;
      }
      
      console.log("Versão do PostgreSQL:", data);
      setIsConnected(true);
      toast.success("Conexão com o banco de dados estabelecida com sucesso!");
    } catch (err) {
      console.error("Erro ao testar conexão:", err);
      setIsConnected(false);
      toast.error("Erro ao testar conexão com o banco de dados");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-background">
      <h3 className="text-lg font-medium mb-4">Teste de Conexão com o Banco de Dados</h3>
      
      <Button 
        onClick={testConnection} 
        disabled={isLoading}
        className="mb-4"
      >
        {isLoading ? "Testando..." : "Testar Conexão"}
      </Button>
      
      {isConnected !== null && (
        <div className={`mt-2 p-3 rounded-md ${isConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {isConnected 
            ? "✅ Conectado ao banco de dados com sucesso!" 
            : "❌ Falha ao conectar com o banco de dados"}
        </div>
      )}
      
      <div className="mt-4 text-sm text-muted-foreground">
        <p>Este teste verifica se seu aplicativo consegue se comunicar com o Supabase.</p>
      </div>
    </div>
  );
};

export default DatabaseConnectionTest;
