
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "login" | "signup";
  setMode?: (mode: "login" | "signup") => void;
}

const AuthModal = ({ isOpen, onClose, mode: externalMode, setMode: externalSetMode }: AuthModalProps) => {
  const { login, signup, isLoading } = useAuth();
  const [internalMode, setInternalMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  // Use external mode/setMode if provided, otherwise use internal state
  const mode = externalMode || internalMode;
  const setMode = externalSetMode || setInternalMode;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (mode === "login") {
        await login(email, password);
        onClose();
      } else {
        await signup(email, password, name);
        // In signup, we don't automatically close the modal in case email confirmation is required
        // The user will see the toast message indicating next steps
      }
    } catch (err: any) {
      // Handle Supabase specific errors
      if (err?.message?.includes("Email not confirmed")) {
        setError("Por favor, confirme seu email antes de fazer login");
      } else if (err?.message?.includes("Invalid login credentials")) {
        setError("Email ou senha inválidos");
      } else if (err?.message?.includes("User already registered")) {
        setError("Este email já está registrado. Faça login em vez disso.");
        setMode("login");
      } else {
        setError(err instanceof Error ? err.message : "Um erro ocorreu");
      }
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setError("");
    setEmail("");
    setPassword("");
    setName("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "login" ? "Entrar" : "Criar Conta"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Senha</Label>
              {mode === "login" && (
                <a href="#" className="text-xs text-crypto-green-500 hover:underline">
                  Esqueceu a senha?
                </a>
              )}
            </div>
            <Input
              id="password"
              type="password"
              placeholder={mode === "login" ? "Sua senha" : "Crie uma senha"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="text-sm text-crypto-red-500 bg-crypto-red-100 p-2 rounded">
              {error}
            </div>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full bg-crypto-green-600 hover:bg-crypto-green-700"
              disabled={isLoading}
            >
              {isLoading
                ? "Carregando..."
                : mode === "login"
                ? "Entrar"
                : "Criar Conta"}
            </Button>
          </div>

          <div className="text-center text-sm">
            {mode === "login"
              ? "Não tem uma conta? "
              : "Já tem uma conta? "}
            <button
              type="button"
              className="text-crypto-green-500 hover:underline font-medium"
              onClick={toggleMode}
              disabled={isLoading}
            >
              {mode === "login" ? "Criar Conta" : "Entrar"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
