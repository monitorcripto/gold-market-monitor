
const DashboardFooter = () => {
  return (
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
  );
};

export default DashboardFooter;
