
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

interface AuthUser {
  id: string;
  email: string;
  name?: string;
  subscriptionTier?: "free" | "basic" | "premium";
  isHardcodedAdmin?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Credenciais do admin hardcoded
const HARDCODED_ADMIN = {
  email: "admin@monitorcripto.com",
  password: "admin123",
  user: {
    id: "hardcoded-admin-id",
    email: "admin@monitorcripto.com",
    name: "Administrador",
    subscriptionTier: "premium" as const,
    isHardcodedAdmin: true
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        
        if (session?.user) {
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata.name,
            subscriptionTier: "free"
          };
          setUser(authUser);
          setSupabaseUser(session.user);
        } else {
          setUser(null);
          setSupabaseUser(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const authUser: AuthUser = {
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata.name,
          subscriptionTier: "free"
        };
        setUser(authUser);
        setSupabaseUser(session.user);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Simple validation
      if (!email || !password) {
        throw new Error("Email e senha são obrigatórios");
      }

      // Verificar se é o admin hardcoded
      if (email === HARDCODED_ADMIN.email && password === HARDCODED_ADMIN.password) {
        setUser(HARDCODED_ADMIN.user);
        toast.success("Login de administrador realizado com sucesso");
        return;
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Login realizado com sucesso");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao fazer login");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      
      // Simple validation
      if (!email || !password || !name) {
        throw new Error("Todos os campos são obrigatórios");
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Conta criada com sucesso");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao criar conta");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Se for admin hardcoded, apenas limpar o estado local
      if (user?.isHardcodedAdmin) {
        setUser(null);
        toast.info("Administrador desconectado");
        return;
      }

      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      toast.info("Você foi desconectado");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao desconectar");
      console.error("Erro ao desconectar:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isAuthenticated: !!user, 
      login, 
      signup, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
