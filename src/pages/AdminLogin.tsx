
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Lock, AlertTriangle, ShieldAlert } from 'lucide-react';
import { toast } from "sonner";

// Pour une démonstration, le nom d'utilisateur et mot de passe sont codés en dur
// Dans une vraie application, ces informations seraient stockées de manière sécurisée côté serveur
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "igc2025";

// Nombre maximal de tentatives de connexion autorisées
const MAX_LOGIN_ATTEMPTS = 5;
// Durée du blocage (en minutes)
const LOCKOUT_DURATION = 10;

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Vérifier si l'administrateur est déjà connecté
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin_authenticated');
    if (isLoggedIn === 'true') {
      navigate('/admin/dashboard');
    }
  }, [navigate]);
  
  // Vérifier si l'accès est bloqué
  useEffect(() => {
    const storedLockoutTime = localStorage.getItem('admin_lockout_until');
    const storedAttempts = localStorage.getItem('admin_login_attempts');
    
    if (storedLockoutTime) {
      const lockoutTime = new Date(storedLockoutTime);
      if (lockoutTime > new Date()) {
        setLockoutUntil(lockoutTime);
      } else {
        // Réinitialiser si le temps de blocage est passé
        localStorage.removeItem('admin_lockout_until');
      }
    }
    
    if (storedAttempts) {
      setLoginAttempts(parseInt(storedAttempts, 10));
    }
  }, []);
  
  // Mise à jour du timer de blocage
  useEffect(() => {
    if (!lockoutUntil) return;
    
    const timer = setInterval(() => {
      const now = new Date();
      if (lockoutUntil <= now) {
        setLockoutUntil(null);
        localStorage.removeItem('admin_lockout_until');
        clearInterval(timer);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [lockoutUntil]);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier si l'accès est bloqué
    if (lockoutUntil && lockoutUntil > new Date()) {
      setErrorMessage(`Trop de tentatives échouées. Réessayez dans quelques minutes.`);
      return;
    }
    
    setIsLoading(true);
    setErrorMessage(null);
    
    // Simulation d'une authentification
    setTimeout(() => {
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Réinitialiser les tentatives de connexion
        localStorage.removeItem('admin_login_attempts');
        localStorage.removeItem('admin_lockout_until');
        setLoginAttempts(0);
        
        // Stockage du statut d'authentification dans le localStorage
        localStorage.setItem('admin_authenticated', 'true');
        
        // Notification de succès
        toast.success("Connexion réussie", {
          description: "Bienvenue dans l'espace administrateur IGC",
        });
        
        // Redirection vers le tableau de bord
        navigate('/admin/dashboard');
      } else {
        // Incrémenter le compteur de tentatives
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        localStorage.setItem('admin_login_attempts', newAttempts.toString());
        
        // Vérifier si le compte devrait être bloqué
        if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
          const lockoutTime = new Date();
          lockoutTime.setMinutes(lockoutTime.getMinutes() + LOCKOUT_DURATION);
          setLockoutUntil(lockoutTime);
          localStorage.setItem('admin_lockout_until', lockoutTime.toISOString());
          
          setErrorMessage(`Votre compte est temporairement bloqué. Réessayez après ${formatLockoutTime(lockoutTime)}.`);
        } else {
          setErrorMessage(`Nom d'utilisateur ou mot de passe incorrect. Tentatives restantes: ${MAX_LOGIN_ATTEMPTS - newAttempts}`);
        }
        
        toast.error("Échec de connexion", {
          description: "Nom d'utilisateur ou mot de passe incorrect.",
        });
        setIsLoading(false);
      }
    }, 1000);
  };
  
  const formatLockoutTime = (date: Date): string => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const isLocked = lockoutUntil && lockoutUntil > new Date();

  return (
    <div className="min-h-screen bg-gradient-to-br from-igc-navy/5 to-igc-purple/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-none shadow-lg bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/f2bba9e8-108e-4607-9b68-2192cbc4963a.png" 
              alt="Logo robot IGC" 
              className="w-16 h-16 object-contain animate-bounce" 
            />
          </div>
          <CardTitle className="text-2xl font-medium text-igc-navy">Administration IGC</CardTitle>
          <CardDescription>
            Connectez-vous pour accéder au tableau de bord
          </CardDescription>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}
          
          {isLocked ? (
            <div className="py-6 text-center space-y-4">
              <ShieldAlert className="w-12 h-12 text-destructive mx-auto mb-2" />
              <h3 className="font-semibold text-lg">Accès temporairement bloqué</h3>
              <p className="text-muted-foreground">
                Trop de tentatives de connexion échouées. <br />
                Veuillez réessayer après {formatLockoutTime(lockoutUntil)}.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate('/')}
              >
                Retour à l'accueil
              </Button>
            </div>
          ) : (
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
                  disabled={isLoading}
                  className="rounded-full border-igc-navy/20 focus:border-igc-magenta focus:ring-igc-magenta"
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
                    disabled={isLoading}
                    className="rounded-full border-igc-navy/20 focus:border-igc-magenta focus:ring-igc-magenta"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={toggleShowPassword}
                    disabled={isLoading}
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
                className="w-full bg-igc-navy hover:bg-igc-magenta"
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
          )}
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
