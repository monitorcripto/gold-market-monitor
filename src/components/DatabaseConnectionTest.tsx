
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const DatabaseConnectionTest = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const testConnection = async () => {
    setLoading(true);
    setIsConnected(null);
    setError('');
    
    try {
      // Simple connection test by getting the current user
      const { data, error } = await supabase.auth.getUser();
      
      if (error && error.message !== 'Auth session missing!') {
        throw error;
      }
      
      // If we get here, the connection is working
      setIsConnected(true);
    } catch (err) {
      setIsConnected(false);
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao conectar ao banco de dados.');
      console.error('Erro na conexão:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-card">
      <div className="mb-4">
        <h3 className="text-lg font-medium">Teste de Conexão com o Banco de Dados</h3>
        <p className="text-muted-foreground text-sm">
          Teste a conexão com o banco de dados Supabase.
        </p>
      </div>
      
      <Button onClick={testConnection} disabled={loading}>
        {loading ? 'Testando...' : 'Testar Conexão'}
      </Button>
      
      {isConnected !== null && (
        <div className={`mt-4 p-3 rounded ${isConnected ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {isConnected ? (
            <div>
              <p className="font-medium">✅ Conexão estabelecida com sucesso!</p>
              <p className="text-sm mt-1">Conectado ao Supabase</p>
            </div>
          ) : (
            <div>
              <p className="font-medium">❌ Falha na conexão</p>
              <p className="text-sm mt-1">Erro: {error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DatabaseConnectionTest;
