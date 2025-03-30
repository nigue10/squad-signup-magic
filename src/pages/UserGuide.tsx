
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ArrowRight, Info, Check, UserPlus, UserCheck, MessagesSquare, Award, Phone, Mail, FileText, Calendar, Clock } from 'lucide-react';
import { getSettings } from '@/lib/settings';

const UserGuide = () => {
  const settings = getSettings();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-igc-navy/5 to-igc-purple/5 py-8">
      <div className="container mx-auto max-w-4xl bg-white p-6 md:p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ChevronLeft size={16} />
              Retour à l'accueil
            </Button>
          </Link>
          
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/f2bba9e8-108e-4607-9b68-2192cbc4963a.png" 
              alt="Logo robot IGC" 
              className="w-10 h-10 object-contain"
            />
            <img 
              src="/lovable-uploads/034e2fe6-1491-4af1-a834-7b32d6879658.png" 
              alt="Logo texte IGC" 
              className="w-10 h-10 object-contain"
            />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-igc-navy text-center mb-2">Guide du Participant</h1>
        <h2 className="text-xl text-igc-magenta text-center mb-8">IGC {settings.applicationYear}</h2>
        
        <div className="bg-igc-navy/5 p-4 rounded-lg mb-8">
          <h3 className="text-lg font-medium text-igc-navy flex items-center gap-2 mb-2">
            <Info size={20} className="text-igc-magenta" />
            Bienvenue dans l'aventure IGC {settings.applicationYear}
          </h3>
          <p className="text-gray-700 mb-2">
            Ce guide vous accompagnera tout au long du processus de sélection, de l'inscription 
            jusqu'à la phase finale. Lisez attentivement chaque étape pour maximiser vos chances de réussite !
          </p>
          <p className="text-gray-700">
            Pour toute question, n'hésitez pas à contacter l'équipe organisatrice à {settings.contactEmail}.
          </p>
        </div>
        
        <div className="space-y-12">
          {/* Étape 1: Fiches de renseignements */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-igc-navy flex items-center justify-center text-white font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-igc-navy">Fiche de renseignements</h3>
            </div>
            
            <div className="pl-14">
              <p className="mb-2">
                La première étape consiste à compléter et renvoyer la fiche de renseignements avec les informations de votre équipe.
              </p>
              
              <div className="bg-igc-purple/5 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-igc-navy mb-2">Composition de l'équipe :</h4>
                <ul className="space-y-2 pl-5 list-disc">
                  <li>Catégorie <strong>Secondaire</strong> : 6 membres obligatoires</li>
                  <li>Catégorie <strong>Supérieur</strong> : minimum 4 à 6 membres</li>
                  <li>Les équipes comprenant des filles sont très encouragées</li>
                </ul>
              </div>
              
              <div className="flex items-center gap-2 text-sm mb-6">
                <FileText size={16} className="text-igc-magenta" />
                <span>Envoi des fiches : <strong>27 mars 2024</strong></span>
              </div>
              
              <div className="flex items-center gap-2 text-sm mb-6">
                <Calendar size={16} className="text-igc-magenta" />
                <span>À renvoyer avant le : <strong>28 mars 2024</strong></span>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full sm:w-auto">
                  <Button asChild className="w-full sm:w-auto flex items-center gap-2 bg-gradient-to-r from-igc-navy to-igc-magenta">
                    <Link to="/registration">
                      Remplir ma fiche
                      <ArrowRight size={16} />
                    </Link>
                  </Button>
                </div>
                
                <p className="text-sm text-gray-500">
                  Vous recevrez une confirmation par email après l'envoi de votre fiche.
                </p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Étape 2: Documents de référence */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-igc-navy flex items-center justify-center text-white font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-igc-navy">Documents de référence</h3>
            </div>
            
            <div className="pl-14">
              <p className="mb-2">
                Après l'envoi de votre fiche, vous recevrez des documents de référence à étudier 
                pour vous préparer au QCM et aux entretiens.
              </p>
              
              <div className="bg-igc-purple/5 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-igc-navy mb-2">Important :</h4>
                <ul className="space-y-2 pl-5 list-disc">
                  <li>Étudiez attentivement ces documents</li>
                  <li>Ils serviront de base pour les questions du QCM</li>
                  <li>Des questions sur leur contenu pourront être posées lors des entretiens</li>
                </ul>
              </div>
              
              <div className="flex items-center gap-2 text-sm mb-6">
                <Calendar size={16} className="text-igc-magenta" />
                <span>Envoi des documents : <strong>28-31 mars 2024</strong></span>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Étape 3: QCM */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-igc-navy flex items-center justify-center text-white font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-igc-navy">Test QCM de présélection</h3>
            </div>
            
            <div className="pl-14">
              <p className="mb-2">
                Toutes les équipes inscrites participeront à un test QCM en ligne via Google Forms. 
                Le lien sera envoyé le jour du test.
              </p>
              
              <div className="bg-igc-purple/5 p-4 rounded-lg mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-igc-navy mb-2">Secondaire :</h4>
                  <ul className="space-y-1 pl-5 list-disc">
                    <li>Date : <strong>4 avril 2024</strong></li>
                    <li>Durée : <strong>1 heure</strong></li>
                    <li>Seuil : <strong>60% (9/15)</strong></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-igc-navy mb-2">Supérieur :</h4>
                  <ul className="space-y-1 pl-5 list-disc">
                    <li>Date : <strong>5 avril 2024</strong></li>
                    <li>Durée : <strong>1h30</strong></li>
                    <li>Seuil : <strong>70% (14/20)</strong></li>
                  </ul>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm mb-6">
                <UserCheck size={16} className="text-igc-magenta" />
                <span>Modalités : <strong>Lien Google Forms envoyé le jour du test</strong></span>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-sm">
                <p className="flex items-center gap-2">
                  <Info size={16} className="text-yellow-600" />
                  <strong>Important :</strong> Les équipes n'atteignant pas le seuil minimum seront éliminées à cette étape.
                </p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Étape 4: Entretiens */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-igc-navy flex items-center justify-center text-white font-bold">
                4
              </div>
              <h3 className="text-xl font-semibold text-igc-navy">Entretien de sélection</h3>
            </div>
            
            <div className="pl-14">
              <p className="mb-2">
                Les équipes ayant réussi le QCM seront invitées à un entretien individuel via Google Meet 
                avec le jury de sélection.
              </p>
              
              <div className="bg-igc-purple/5 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-igc-navy mb-2">Déroulement des entretiens :</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <h5 className="font-medium mb-1">Secondaire :</h5>
                    <ul className="space-y-1 pl-5 list-disc text-sm">
                      <li>Durée : <strong>15-20 minutes</strong></li>
                      <li>Critères : Motivation et esprit d'équipe</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-1">Supérieur :</h5>
                    <ul className="space-y-1 pl-5 list-disc text-sm">
                      <li>Durée : <strong>20-25 minutes</strong></li>
                      <li>Critères : Motivation, esprit d'équipe et compétences techniques</li>
                    </ul>
                  </div>
                </div>
                
                <h4 className="font-medium text-igc-navy mt-4 mb-2">Important :</h4>
                <ul className="space-y-2 pl-5 list-disc">
                  <li>Pas d'exposé à préparer</li>
                  <li>Des questions sur les documents de référence pourront être posées</li>
                  <li>Les détails (date, heure, lien) seront envoyés après la phase QCM</li>
                </ul>
              </div>
              
              <div className="flex items-center gap-2 text-sm mb-6">
                <MessagesSquare size={16} className="text-igc-magenta" />
                <span>Période des entretiens : <strong>6-19 avril 2024</strong></span>
              </div>
              
              <div className="bg-green-50 border border-green-200 p-3 rounded-lg text-sm mb-4">
                <p className="flex items-center gap-2">
                  <Check size={16} className="text-green-600" />
                  <strong>Conseil :</strong> Préparez-vous en étudiant bien les documents de référence et en réfléchissant à votre motivation.
                </p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Étape 5: Sélection finale */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-igc-navy flex items-center justify-center text-white font-bold">
                5
              </div>
              <h3 className="text-xl font-semibold text-igc-navy">Sélection finale</h3>
            </div>
            
            <div className="pl-14">
              <p className="mb-2">
                Après tous les entretiens, les équipes seront classées selon leur performance à l'entretien.
                Les meilleures équipes seront sélectionnées pour participer à la phase finale du concours.
              </p>
              
              <div className="bg-igc-purple/5 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-igc-navy mb-2">Nombre d'équipes sélectionnées :</h4>
                <ul className="space-y-1 pl-5 list-disc">
                  <li>Secondaire : <strong>16 équipes</strong></li>
                  <li>Supérieur : <strong>16 équipes</strong></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-igc-navy mb-4">Dates clés à retenir</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-100 shadow-sm rounded-lg p-4">
              <p className="text-sm font-medium text-igc-navy">Envoi des fiches</p>
              <p className="text-lg">27 mars 2024</p>
            </div>
            
            <div className="bg-white border border-gray-100 shadow-sm rounded-lg p-4">
              <p className="text-sm font-medium text-igc-navy">Date limite de retour</p>
              <p className="text-lg">28 mars 2024</p>
            </div>
            
            <div className="bg-white border border-gray-100 shadow-sm rounded-lg p-4">
              <p className="text-sm font-medium text-igc-navy">QCM Secondaire</p>
              <p className="text-lg">4 avril 2024</p>
            </div>
            
            <div className="bg-white border border-gray-100 shadow-sm rounded-lg p-4">
              <p className="text-sm font-medium text-igc-navy">QCM Supérieur</p>
              <p className="text-lg">5 avril 2024</p>
            </div>
            
            <div className="bg-white border border-gray-100 shadow-sm rounded-lg p-4">
              <p className="text-sm font-medium text-igc-navy">Entretiens</p>
              <p className="text-lg">6-19 avril 2024</p>
            </div>
          </div>
          
          <div className="mt-10 p-5 bg-gradient-to-r from-igc-navy/5 to-igc-purple/10 rounded-lg border border-igc-purple/10">
            <h3 className="text-lg font-semibold text-igc-navy mb-3 flex items-center justify-center gap-2">
              <Info className="w-5 h-5 text-igc-magenta" /> Support et contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-igc-navy" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-igc-magenta">preselection@igc.ci</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-igc-navy" />
                <div>
                  <p className="text-sm font-medium">WhatsApp</p>
                  <p className="text-igc-magenta">+225 0701563797</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Button asChild className="bg-gradient-to-r from-igc-navy to-igc-magenta">
              <Link to="/registration">
                Remplir ma fiche de renseignements
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;
