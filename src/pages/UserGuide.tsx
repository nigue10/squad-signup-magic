
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ArrowRight, Info, Check, UserPlus, UserCheck, MessagesSquare, Award } from 'lucide-react';
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
          {/* Étape 1: Inscription */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-igc-navy flex items-center justify-center text-white font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-igc-navy">Inscription de votre équipe</h3>
            </div>
            
            <div className="pl-14">
              <p className="mb-2">
                La première étape consiste à compléter le formulaire d'inscription en ligne avec les informations de votre équipe.
              </p>
              
              <div className="bg-igc-purple/5 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-igc-navy mb-2">Composition de l'équipe :</h4>
                <ul className="space-y-2 pl-5 list-disc">
                  <li>Catégorie <strong>Secondaire</strong> : 6 membres obligatoires</li>
                  <li>Catégorie <strong>Supérieur</strong> : minimum 4 membres</li>
                  <li>Les équipes comprenant des filles sont fortement encouragées</li>
                </ul>
              </div>
              
              <div className="flex items-center gap-2 text-sm mb-6">
                <UserPlus size={16} className="text-igc-magenta" />
                <span>Date limite d'inscription : <strong>{settings.registrationDeadline}</strong></span>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full sm:w-auto">
                  <Button asChild className="w-full sm:w-auto flex items-center gap-2 bg-gradient-to-r from-igc-navy to-igc-magenta">
                    <Link to="/registration">
                      S'inscrire maintenant
                      <ArrowRight size={16} />
                    </Link>
                  </Button>
                </div>
                
                <p className="text-sm text-gray-500">
                  Vous recevrez une confirmation par email après votre inscription.
                </p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Étape 2: QCM */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-igc-navy flex items-center justify-center text-white font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-igc-navy">Test QCM de présélection</h3>
            </div>
            
            <div className="pl-14">
              <p className="mb-2">
                Après la clôture des inscriptions, toutes les équipes inscrites recevront par email un lien 
                vers un test QCM en ligne à compléter collectivement.
              </p>
              
              <div className="bg-igc-purple/5 p-4 rounded-lg mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-igc-navy mb-2">Seuils de qualification :</h4>
                  <ul className="space-y-1 pl-5 list-disc">
                    <li>Secondaire : <strong>{settings.secondaryQcmThreshold}%</strong> minimum</li>
                    <li>Supérieur : <strong>{settings.higherQcmThreshold}%</strong> minimum</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-igc-navy mb-2">Contenu du QCM :</h4>
                  <ul className="space-y-1 pl-5 list-disc">
                    <li>Connaissances générales en robotique</li>
                    <li>Logique et résolution de problèmes</li>
                    <li>Questions spécifiques par catégorie</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm mb-6">
                <UserCheck size={16} className="text-igc-magenta" />
                <span>Date des QCM : à partir du <strong>{settings.qcmStartDate}</strong></span>
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
          
          {/* Étape 3: Entretiens */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-igc-navy flex items-center justify-center text-white font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-igc-navy">Entretien de sélection</h3>
            </div>
            
            <div className="pl-14">
              <p className="mb-2">
                Les équipes ayant réussi le QCM seront invitées à un entretien en ligne via Google Meet 
                avec le jury de sélection.
              </p>
              
              <div className="bg-igc-purple/5 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-igc-navy mb-2">Déroulement de l'entretien :</h4>
                <ul className="space-y-2 pl-5 list-disc">
                  <li>Présentation de l'équipe et de sa motivation (5 min)</li>
                  <li>Questions du jury sur le projet et les compétences (10 min)</li>
                  <li>Discussion sur la vision et les valeurs de l'équipe (5 min)</li>
                </ul>
                
                <h4 className="font-medium text-igc-navy mt-4 mb-2">Critères d'évaluation :</h4>
                <ul className="space-y-2 pl-5 list-disc">
                  <li>Motivation et cohésion de l'équipe</li>
                  <li>Compréhension des enjeux de la robotique</li>
                  <li>Créativité et capacité à résoudre des problèmes</li>
                  <li>Pour le Supérieur : compétences techniques supplémentaires</li>
                </ul>
              </div>
              
              <div className="flex items-center gap-2 text-sm mb-6">
                <MessagesSquare size={16} className="text-igc-magenta" />
                <span>Période des entretiens : <strong>{settings.interviewPeriod}</strong></span>
              </div>
              
              <div className="bg-green-50 border border-green-200 p-3 rounded-lg text-sm mb-4">
                <p className="flex items-center gap-2">
                  <Check size={16} className="text-green-600" />
                  <strong>Conseil :</strong> Préparez-vous à parler de vos expériences antérieures en matière de projets de groupe et de robotique.
                </p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Étape 4: Sélection finale */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-igc-navy flex items-center justify-center text-white font-bold">
                4
              </div>
              <h3 className="text-xl font-semibold text-igc-navy">Sélection finale</h3>
            </div>
            
            <div className="pl-14">
              <p className="mb-2">
                Après tous les entretiens, les équipes seront classées selon leur note d'entretien (et non un score combiné).
                Les meilleures équipes seront sélectionnées pour participer à la phase finale du concours.
              </p>
              
              <div className="bg-igc-purple/5 p-4 rounded-lg mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-igc-navy mb-2">Nombre d'équipes sélectionnées :</h4>
                  <ul className="space-y-1 pl-5 list-disc">
                    <li>Secondaire : <strong>{settings.secondaryTeamSelectionCount} équipes</strong></li>
                    <li>Supérieur : <strong>{settings.higherTeamSelectionCount} équipes</strong></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-igc-navy mb-2">Critères de sélection :</h4>
                  <ul className="space-y-1 pl-5 list-disc">
                    <li>Uniquement basé sur le score d'entretien</li>
                    <li>Classement par catégorie</li>
                    <li>En cas d'égalité : évaluation supplémentaire</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm mb-6">
                <Award size={16} className="text-igc-magenta" />
                <span>Annonce des résultats : <strong>{settings.resultsDate}</strong></span>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm">
                <h4 className="font-medium text-igc-navy mb-2 flex items-center gap-2">
                  <Info size={16} className="text-blue-600" />
                  Et après ?
                </h4>
                <p className="mb-2">
                  Les équipes sélectionnées recevront des instructions détaillées pour la phase finale, 
                  incluant le thème du challenge, les ressources disponibles, et le calendrier des activités.
                </p>
                <p>
                  Les équipes non retenues recevront un feedback constructif et seront encouragées 
                  à participer aux prochaines éditions.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-igc-navy mb-4">Dates clés à retenir</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-100 shadow-sm rounded-lg p-4">
              <p className="text-sm font-medium text-igc-navy">Inscription</p>
              <p className="text-lg">{settings.registrationDeadline}</p>
            </div>
            
            <div className="bg-white border border-gray-100 shadow-sm rounded-lg p-4">
              <p className="text-sm font-medium text-igc-navy">QCM</p>
              <p className="text-lg">{settings.qcmStartDate}</p>
            </div>
            
            <div className="bg-white border border-gray-100 shadow-sm rounded-lg p-4">
              <p className="text-sm font-medium text-igc-navy">Entretiens</p>
              <p className="text-lg">{settings.interviewPeriod}</p>
            </div>
            
            <div className="bg-white border border-gray-100 shadow-sm rounded-lg p-4">
              <p className="text-sm font-medium text-igc-navy">Résultats</p>
              <p className="text-lg">{settings.resultsDate}</p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Button asChild className="bg-gradient-to-r from-igc-navy to-igc-magenta">
              <Link to="/registration">
                Commencer votre inscription
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
