
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import LogoHeader from '@/components/LogoHeader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Check, AlertTriangle, Calendar, Clock, FileText, Mail, MessageSquare } from 'lucide-react';

const UserGuide = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-igc-purple/5">
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 border border-igc-purple/10">
          <LogoHeader />
          
          <h1 className="text-2xl md:text-3xl font-bold text-center text-igc-navy mb-6 uppercase">
            GUIDE DU PARTICIPANT - IGC 2025
          </h1>
          
          <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
            <div className="flex items-start">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-yellow-800">Important</h3>
                <p className="text-yellow-700">
                  Veuillez lire attentivement ce guide qui contient toutes les informations 
                  nécessaires pour les étapes de présélection.
                </p>
              </div>
            </div>
          </div>
          
          <Card className="mb-8">
            <CardHeader className="bg-igc-navy text-white">
              <CardTitle>Calendrier des présélections</CardTitle>
              <CardDescription className="text-gray-200">
                Dates clés à retenir pour le processus de sélection
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Date</TableHead>
                    <TableHead>Événement</TableHead>
                    <TableHead className="text-right">Durée</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">27 mars 2025</TableCell>
                    <TableCell>Envoi des fiches d'inscription</TableCell>
                    <TableCell className="text-right">À renvoyer avant le 28 mars</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">28-31 mars 2025</TableCell>
                    <TableCell>Envoi des documents de référence</TableCell>
                    <TableCell className="text-right">-</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">4 avril 2025</TableCell>
                    <TableCell>QCM Catégorie Secondaire</TableCell>
                    <TableCell className="text-right">1 heure</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">5 avril 2025</TableCell>
                    <TableCell>QCM Catégorie Supérieur</TableCell>
                    <TableCell className="text-right">1h30</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">6-19 avril 2025</TableCell>
                    <TableCell>Entretiens individuels</TableCell>
                    <TableCell className="text-right">
                      15-20 min (Sec.) / 20-25 min (Sup.)
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Accordion type="single" collapsible className="mb-8">
            <AccordionItem value="criteria">
              <AccordionTrigger className="text-lg font-medium text-igc-navy">
                Critères de sélection
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 space-y-4 p-4">
                <h3 className="font-bold">Étape 1: QCM</h3>
                <ul className="list-disc list-inside pl-5 space-y-2">
                  <li>
                    <strong>Catégorie Secondaire:</strong> Score minimum de 60% (9/15) pour être qualifié
                  </li>
                  <li>
                    <strong>Catégorie Supérieur:</strong> Score minimum de 70% (14/20) pour être qualifié
                  </li>
                </ul>
                
                <h3 className="font-bold mt-4">Étape 2: Entretiens</h3>
                <ul className="list-disc list-inside pl-5 space-y-2">
                  <li>
                    <strong>Catégorie Secondaire:</strong> Évaluation de la motivation et de l'esprit d'équipe
                  </li>
                  <li>
                    <strong>Catégorie Supérieur:</strong> Évaluation des compétences techniques en plus de la motivation
                  </li>
                </ul>
                
                <h3 className="font-bold mt-4">Sélection finale</h3>
                <ul className="list-disc list-inside pl-5 space-y-2">
                  <li>
                    <strong>Objectif:</strong> 16 équipes Secondaire et 16 équipes Supérieur
                  </li>
                  <li>Les meilleures équipes seront sélectionnées selon leur classement après l'entretien</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="instructions">
              <AccordionTrigger className="text-lg font-medium text-igc-navy">
                Instructions importantes
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 space-y-4 p-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-igc-navy mr-2" />
                    <p><strong>Documents:</strong> Étudiez attentivement les documents de référence pour le QCM et les entretiens.</p>
                  </div>
                  
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-2" />
                    <p><strong>QCM:</strong> Sera distribué via Google Forms. Le lien vous sera envoyé le jour du test.</p>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                    <p><strong>Entretiens:</strong> Se dérouleront via Google Meet. Les détails vous seront communiqués après qualification.</p>
                  </div>
                  
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
                    <p><strong>Note:</strong> Aucun exposé ne sera demandé, mais vous pourriez être interrogé sur les documents fournis.</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="support">
              <AccordionTrigger className="text-lg font-medium text-igc-navy">
                Support et contact
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 space-y-4 p-4">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-igc-navy mr-2 mt-0.5" />
                    <div>
                      <p><strong>Email:</strong></p>
                      <p className="text-blue-600">preselection@igc.ci</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MessageSquare className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                    <div>
                      <p><strong>WhatsApp:</strong></p>
                      <p className="text-blue-600">+225 0701563797</p>
                      <p className="text-sm text-gray-500">Des groupes WhatsApp seront créés par catégorie pour faciliter la communication.</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded border border-gray-200 mt-4">
                    <p className="text-sm text-gray-600">
                      <strong>Horaires de disponibilité:</strong> Du lundi au vendredi, de 8h à 18h. Nous ferons notre possible pour répondre à toutes vos questions dans les meilleurs délais.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="border-igc-navy text-igc-navy hover:bg-igc-navy/5"
            >
              Retour à l'accueil
            </Button>
            
            <Button 
              onClick={() => navigate('/registration')}
              className="bg-igc-navy hover:bg-igc-navy/90"
            >
              S'inscrire maintenant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;
