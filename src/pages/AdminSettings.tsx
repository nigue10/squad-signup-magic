
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Save, RotateCcw, ArrowLeft } from 'lucide-react';
import { IGCSettings, getSettings, updateSettings, resetSettings } from '@/lib/settings';

const AdminSettings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<IGCSettings>(getSettings());
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    // Charger les paramètres au montage du composant
    setSettings(getSettings());
  }, []);

  // Mettre à jour un paramètre
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Convertir en nombre si c'est un champ numérique
    const parsedValue = type === 'number' ? parseInt(value) : value;
    
    setSettings(prev => ({
      ...prev,
      [name]: parsedValue
    }));
    
    setIsModified(true);
  };

  // Enregistrer les modifications
  const handleSave = () => {
    updateSettings(settings);
    toast.success("Paramètres enregistrés avec succès");
    setIsModified(false);
  };

  // Réinitialiser aux valeurs par défaut
  const handleReset = () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser tous les paramètres ? Cette action ne peut pas être annulée.")) {
      resetSettings();
      setSettings(getSettings());
      toast.info("Paramètres réinitialisés aux valeurs par défaut");
      setIsModified(false);
    }
  };

  return (
    <div className="container max-w-5xl py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate('/admin/dashboard')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-igc-navy">Paramètres du Concours</h1>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Réinitialiser
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!isModified}
            className="flex items-center gap-2 bg-igc-navy hover:bg-igc-navy/90"
          >
            <Save className="h-4 w-4" />
            Enregistrer
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="selection">Sélection</TabsTrigger>
          <TabsTrigger value="texts">Textes</TabsTrigger>
          <TabsTrigger value="dates">Dates</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
              <CardDescription>
                Informations de base et de contact pour le concours
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="contactEmail">Email de contact</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  value={settings.contactEmail}
                  onChange={handleChange}
                  placeholder="email@example.com"
                />
                <p className="text-sm text-muted-foreground">
                  Cet email sera affiché sur la page d'accueil pour les participants.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="applicationYear">Année du concours</Label>
                <Input
                  id="applicationYear"
                  name="applicationYear"
                  value={settings.applicationYear}
                  onChange={handleChange}
                  placeholder="2025"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="selection">
          <Card>
            <CardHeader>
              <CardTitle>Critères de sélection</CardTitle>
              <CardDescription>
                Paramètres concernant les seuils et quotas de sélection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="secondaryTeamSelectionCount">
                    Nombre d'équipes Secondaire à sélectionner
                  </Label>
                  <Input
                    id="secondaryTeamSelectionCount"
                    name="secondaryTeamSelectionCount"
                    type="number"
                    min="1"
                    value={settings.secondaryTeamSelectionCount}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="higherTeamSelectionCount">
                    Nombre d'équipes Supérieur à sélectionner
                  </Label>
                  <Input
                    id="higherTeamSelectionCount"
                    name="higherTeamSelectionCount"
                    type="number"
                    min="1"
                    value={settings.higherTeamSelectionCount}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="secondaryQcmThreshold">
                    Seuil de qualification QCM Secondaire (%)
                  </Label>
                  <Input
                    id="secondaryQcmThreshold"
                    name="secondaryQcmThreshold"
                    type="number"
                    min="0"
                    max="100"
                    value={settings.secondaryQcmThreshold}
                    onChange={handleChange}
                  />
                  <p className="text-sm text-muted-foreground">
                    Pourcentage minimum requis pour être qualifié à l'entretien.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="higherQcmThreshold">
                    Seuil de qualification QCM Supérieur (%)
                  </Label>
                  <Input
                    id="higherQcmThreshold"
                    name="higherQcmThreshold"
                    type="number"
                    min="0"
                    max="100"
                    value={settings.higherQcmThreshold}
                    onChange={handleChange}
                  />
                  <p className="text-sm text-muted-foreground">
                    Pourcentage minimum requis pour être qualifié à l'entretien.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="texts">
          <Card>
            <CardHeader>
              <CardTitle>Textes personnalisés</CardTitle>
              <CardDescription>
                Messages et descriptions affichés sur le site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="welcomeMessage">Message de bienvenue</Label>
                <Textarea
                  id="welcomeMessage"
                  name="welcomeMessage"
                  value={settings.welcomeMessage}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationInfo">Informations d'inscription</Label>
                <Textarea
                  id="registrationInfo"
                  name="registrationInfo"
                  value={settings.registrationInfo}
                  onChange={handleChange}
                  rows={4}
                />
                <p className="text-sm text-muted-foreground">
                  Ces informations sont affichées sur la page d'accueil pour guider les participants.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dates">
          <Card>
            <CardHeader>
              <CardTitle>Dates importantes</CardTitle>
              <CardDescription>
                Échéances et périodes du concours
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="registrationDeadline">Date limite d'inscription</Label>
                  <Input
                    id="registrationDeadline"
                    name="registrationDeadline"
                    value={settings.registrationDeadline}
                    onChange={handleChange}
                    placeholder="30 octobre 2024"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="qcmStartDate">Date de début des QCM</Label>
                  <Input
                    id="qcmStartDate"
                    name="qcmStartDate"
                    value={settings.qcmStartDate}
                    onChange={handleChange}
                    placeholder="5 novembre 2024"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="interviewPeriod">Période des entretiens</Label>
                  <Input
                    id="interviewPeriod"
                    name="interviewPeriod"
                    value={settings.interviewPeriod}
                    onChange={handleChange}
                    placeholder="15-25 novembre 2024"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="resultsDate">Date des résultats</Label>
                  <Input
                    id="resultsDate"
                    name="resultsDate"
                    value={settings.resultsDate}
                    onChange={handleChange}
                    placeholder="30 novembre 2024"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
