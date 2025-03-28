
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import LogoHeader from '@/components/LogoHeader';
import { Eye, EyeOff, Lock } from 'lucide-react';

// Pour une démonstration, le nom d'utilisateur et mot de passe sont codés en dur
// Dans une vraie application, ces informations seraient stockées de manière sécurisée côté serveur
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "igc2025";

const AdminLogin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Vérifier si l'administrateur est déjà connecté
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin_authenticated');
    if (isLoggedIn === 'true') {
      navigate('/admin/dashboard');
    }
  }, [navigate]);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulation d'une authentification
    setTimeout(() => {
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Stockage du statut d'authentification dans le localStorage
        localStorage.setItem('admin_authenticated', 'true');
        
        // Redirection vers le tableau de bord
        navigate('/admin/dashboard');
      } else {
        toast({
          title: "Échec de connexion",
          description: "Nom d'utilisateur ou mot de passe incorrect.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    }, 1000);
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-igc-gray flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <LogoHeader />
          </div>
          <CardTitle className="text-2xl text-center">Administration IGC</CardTitle>
          <CardDescription className="text-center">
            Connectez-vous pour accéder au tableau de bord
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Lock className="h-4 w-4 animate-pulse" /> Connexion en cours...
                </span>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          <div className="w-full">
            Pour la démonstration, utilisez: {ADMIN_USERNAME} / {ADMIN_PASSWORD}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
