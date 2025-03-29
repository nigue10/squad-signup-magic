
# IGC - Ivorian Genius Contest

Application de gestion des inscriptions et du processus de sélection pour l'Ivorian Genius Contest.

## Fonctionnalités principales

### Interface publique
- Page d'accueil avec informations sur le concours
- Formulaire d'inscription pour les équipes
- Guide détaillé du participant expliquant le processus de sélection

### Interface administrative
- Tableau de bord de suivi des équipes
- Gestion des scores QCM et qualification
- Planification des entretiens
- Notation des entretiens et sélection finale
- Paramètres personnalisables
- Exportation des données en CSV

## Guide d'utilisation

### Pour les participants

1. **Inscription d'équipe**
   - Accédez à la page d'accueil
   - Cliquez sur "Inscription d'équipe"
   - Remplissez le formulaire en 4 étapes
   - Soumettez votre inscription

2. **Après l'inscription**
   - Attendez l'email de confirmation
   - Préparez-vous pour le test QCM
   - Si qualifiés, participez à l'entretien de sélection

### Pour les administrateurs

1. **Accès à l'administration**
   - Accédez à `/admin-portal`
   - Connectez-vous avec les identifiants administrateur

2. **Tableau de bord**
   - Consultez les statistiques générales
   - Filtrez les équipes par catégorie et statut
   - Gérez le processus de sélection

3. **Gestion des équipes**
   - Entrez les scores QCM
   - Planifiez les entretiens pour les équipes qualifiées
   - Enregistrez les scores d'entretien
   - Consultez le classement automatique
   - Prenez les décisions finales de sélection

4. **Paramètres personnalisables**
   - Modifiez les textes affichés sur le site
   - Ajustez le nombre d'équipes à sélectionner
   - Configurez les seuils de qualification QCM
   - Mettez à jour les dates importantes

5. **Exportation des données**
   - Utilisez le bouton d'exportation CSV dans le tableau de bord

## Processus de sélection

1. **Inscription**
   - Les équipes s'inscrivent via le formulaire en ligne
   - Catégorie Secondaire: 6 membres obligatoires
   - Catégorie Supérieur: minimum 4 membres

2. **QCM**
   - Les équipes passent un test QCM
   - Seuil de qualification:
     - Secondaire: minimum 60%
     - Supérieur: minimum 70%

3. **Entretiens**
   - Les équipes qualifiées sont invitées à un entretien
   - L'entretien est noté sur 10

4. **Sélection finale**
   - Les meilleures notes d'entretien sont sélectionnées:
     - 16 équipes pour la catégorie Secondaire
     - 16 équipes pour la catégorie Supérieur

## Déploiement

Pour déployer l'application sur Netlify, consultez le fichier `NETLIFY_DEPLOYMENT.md`.

## Notes techniques

- L'application utilise React avec TypeScript et Vite
- Le stockage des données est basé sur localStorage
- L'interface utilisateur utilise Tailwind CSS et shadcn/ui
- L'application est responsive (mobile et desktop)

## Personnalisation

Les paramètres suivants peuvent être modifiés dans l'interface d'administration:

- Email de contact
- Année du concours
- Textes d'information
- Nombre d'équipes à sélectionner
- Seuils de qualification QCM
- Dates importantes
