
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Shield } from "lucide-react";
import AuthModal from "./AuthModal";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const closeSheet = () => setIsSheetOpen(false);

  const navigationItems = [
    { path: "/", label: "Início" },
    { path: "/dashboard", label: "Dashboard", requiresAuth: true },
    { path: "/pricing", label: "Preços" },
  ];

  // Add admin link if user is admin
  if (isAdmin) {
    navigationItems.splice(-1, 0, { path: "/admin", label: "Admin", requiresAuth: true });
  }

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container px-4 max-w-7xl">
        <div className="flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="font-bold text-lg bg-gradient-to-r from-crypto-green-500 to-crypto-gold-500 bg-clip-text text-transparent">
              Monitor Cripto
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => {
              if (item.requiresAuth && !isAuthenticated) return null;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm transition-colors hover:text-foreground/80 flex items-center gap-2 ${
                    location.pathname === item.path 
                      ? "text-foreground font-medium" 
                      : "text-foreground/60"
                  }`}
                >
                  {item.path === "/admin" && <Shield className="h-4 w-4" />}
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  Olá, {user?.full_name || user?.email}
                  {isAdmin && <Shield className="inline h-4 w-4 ml-1 text-red-500" />}
                </span>
                <Button variant="outline" onClick={handleLogout}>
                  Sair
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsAuthModalOpen(true)}>
                Entrar
              </Button>
            )}
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Monitor Cripto</SheetTitle>
                <SheetDescription>
                  Navegue pelas seções da plataforma
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-6">
                {navigationItems.map((item) => {
                  if (item.requiresAuth && !isAuthenticated) return null;
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={closeSheet}
                      className={`text-sm transition-colors hover:text-foreground/80 flex items-center gap-2 ${
                        location.pathname === item.path 
                          ? "text-foreground font-medium" 
                          : "text-foreground/60"
                      }`}
                    >
                      {item.path === "/admin" && <Shield className="h-4 w-4" />}
                      {item.label}
                    </Link>
                  );
                })}
                
                <div className="pt-4 border-t">
                  {isAuthenticated ? (
                    <div className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        Olá, {user?.full_name || user?.email}
                        {isAdmin && <Shield className="inline h-4 w-4 ml-1 text-red-500" />}
                      </div>
                      <Button variant="outline" onClick={handleLogout} className="w-full">
                        Sair
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => {
                      setIsAuthModalOpen(true);
                      closeSheet();
                    }} className="w-full">
                      Entrar
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </nav>
  );
};

export default Navbar;
