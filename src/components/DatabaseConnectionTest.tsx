
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";

const DatabaseConnectionTest = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const testConnection = async () => {
      try {
        setIsLoading(true);
        // Call the test_connection RPC function
        const { data, error } = await supabase.rpc("get_postgresql_version");

        if (error) {
          console.error("Database connection error:", error);
          setIsConnected(false);
          setMessage(error.message);
        } else {
          setIsConnected(true);
          setMessage(data as string);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setIsConnected(false);
        setMessage("Erro inesperado ao testar a conexão");
      } finally {
        setIsLoading(false);
      }
    };

    testConnection();
  }, []);

  return (
    <Card className={`border-l-4 ${
      isConnected === null 
        ? "border-gray-300" 
        : isConnected 
          ? "border-green-500" 
          : "border-red-500"
    }`}>
      <CardContent className="p-4">
        <div className="flex items-center">
          {isLoading ? (
            <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
          ) : isConnected ? (
            <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
          )}
          <div>
            <h3 className="font-medium">
              {isLoading 
                ? "Testando conexão com o banco de dados..." 
                : isConnected 
                  ? "Conexão com o banco de dados estabelecida!" 
                  : "Erro na conexão com o banco de dados"
              }
            </h3>
            {!isLoading && (
              <p className="text-sm text-muted-foreground">{message}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseConnectionTest;
