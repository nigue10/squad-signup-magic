
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Vérification simplifiée - sera remplacée par Supabase Auth
      if (username === 'admin' && password === 'igc2025') {
        // Simuler un délai pour le chargement
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Stocker une indication simple que l'utilisateur est connecté
        sessionStorage.setItem('isAdminLoggedIn', 'true');
        
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans l'espace administrateur",
        });
        
        navigate('/admin/dashboard');
      } else {
        toast({
          title: "Erreur de connexion",
          description: "Identifiants incorrects. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      toast({
        title: "Erreur de connexion",
        description: "Une erreur est survenue. Veuillez réessayer plus tard.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-igc-gray p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <img 
            src="/lovable-uploads/f2bba9e8-108e-4607-9b68-2192cbc4963a.png" 
            alt="Logo IGC" 
            className="w-20 h-20 object-contain"
          />
        </div>
        
        <h1 className="text-2xl font-bold text-center text-igc-blue mb-6">
          Espace Administrateur
        </h1>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Nom d'utilisateur</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <Button variant="link" onClick={() => navigate('/')}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
