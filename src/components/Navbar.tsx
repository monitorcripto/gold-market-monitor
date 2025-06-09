
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, Bell, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AuthModal from "./AuthModal";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const { user, isAuthenticated, logout } = useAuth();
  const isMobile = useIsMobile();

  const handleAuthClick = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and main nav */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="font-bold text-xl bg-gradient-to-r from-crypto-green-500 to-crypto-gold-500 bg-clip-text text-transparent mr-2">
                Monitor Cripto
              </span>
            </Link>
            
            {/* Desktop navigation */}
            <div className="hidden md:flex ml-8 space-x-6">
              <Link to="/" className="text-foreground hover:text-crypto-green-500">
                Dashboard
              </Link>
              <Link to="/pricing" className="text-foreground hover:text-crypto-green-500">
                Planos
              </Link>
              <Link to="/about" className="text-foreground hover:text-crypto-green-500">
                Sobre
              </Link>
            </div>
          </div>

          {/* Auth buttons */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Bell className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="p-2 text-sm">
                      <div className="font-medium">Notificações</div>
                      <div className="text-muted-foreground">Sem novas notificações</div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <User className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="p-2 text-sm">
                      <div className="font-medium">{user?.name || "Usuário"}</div>
                      <div className="text-muted-foreground">{user?.email}</div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="w-full cursor-pointer">
                        Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="w-full cursor-pointer">
                        Configurações
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="cursor-pointer">
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                {!isMobile && (
                  <Button variant="outline" onClick={() => handleAuthClick("login")}>
                    Entrar
                  </Button>
                )}
                <Button onClick={() => handleAuthClick("signup")}>
                  {isMobile ? "Entrar" : "Criar Conta"}
                </Button>
              </>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-3 pb-3 border-t border-border mt-3">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="px-2 py-1 rounded hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/pricing"
                className="px-2 py-1 rounded hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                Planos
              </Link>
              <Link
                to="/about"
                className="px-2 py-1 rounded hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sobre
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Auth modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        setMode={setAuthMode}
      />
    </nav>
  );
};

export default Navbar;
