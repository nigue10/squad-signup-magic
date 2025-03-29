
# Guide de déploiement sur Netlify pour l'application IGC

Ce guide explique comment déployer l'application IGC sur Netlify pour la rendre accessible en ligne.

## Prérequis

1. Un compte Netlify (inscription gratuite sur [netlify.com](https://www.netlify.com/))
2. Le code source de l'application (téléchargé depuis Lovable)

## Étapes de déploiement

### 1. Préparation du projet

Avant de déployer, assurez-vous que votre projet est prêt :

- Le fichier `src/App.tsx` doit être configuré avec toutes les routes de l'application
- Le fichier `index.html` doit être présent à la racine du projet
- Le dossier `public` doit contenir toutes les ressources statiques (images, etc.)

### 2. Méthode de déploiement 1 : Déploiement direct depuis Lovable

La méthode la plus simple est d'utiliser le bouton "Publish" intégré à Lovable :

1. Dans l'interface Lovable, cliquez sur le bouton "Share" en haut à droite
2. Sélectionnez "Publish"
3. Suivez les instructions pour publier votre site

### 3. Méthode de déploiement 2 : Déploiement manuel sur Netlify

Si vous préférez un déploiement manuel :

1. **Exportez votre code depuis Lovable**
   - Connectez votre projet Lovable à GitHub
   - Clonez le dépôt GitHub sur votre ordinateur

2. **Préparez votre projet pour Netlify**
   - Créez un fichier `netlify.toml` à la racine de votre projet avec le contenu suivant :

   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

3. **Déployez sur Netlify**
   - Connectez-vous à votre compte Netlify
   - Cliquez sur "New site from Git"
   - Sélectionnez GitHub (ou votre fournisseur Git)
   - Autorisez Netlify à accéder à vos dépôts
   - Sélectionnez le dépôt contenant votre projet IGC
   - Configurez les options de build :
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Cliquez sur "Deploy site"

### 4. Configuration du domaine (optionnel)

Si vous souhaitez utiliser un domaine personnalisé :

1. Dans le dashboard Netlify, accédez à votre site
2. Cliquez sur "Domain settings"
3. Sous "Custom domains", cliquez sur "Add custom domain"
4. Suivez les instructions pour configurer votre domaine

### 5. Variables d'environnement (si nécessaire)

Si votre application utilise des variables d'environnement :

1. Dans le dashboard Netlify, accédez à votre site
2. Cliquez sur "Site settings" > "Environment variables"
3. Ajoutez vos variables d'environnement en cliquant sur "Add variable"

## Après le déploiement

Une fois le déploiement terminé, Netlify fournira une URL pour accéder à votre application (exemple : `https://votre-projet.netlify.app`).

### Notes importantes pour IGC :

1. **Persistance des données** : L'application IGC utilise le localStorage pour stocker les données. Ces données sont spécifiques à chaque navigateur et appareil. Pour une solution plus robuste en production, envisagez d'implémenter une base de données.

2. **Accès administrateur** : L'interface d'administration est accessible via `/admin-portal`. Assurez-vous que seules les personnes autorisées connaissent cette URL.

3. **Sauvegarde des données** : Utilisez régulièrement la fonction d'exportation CSV dans le tableau de bord administrateur pour sauvegarder les données des équipes.

## Dépannage

- **Problèmes de routing** : Si les routes ne fonctionnent pas correctement, vérifiez que le fichier `netlify.toml` est correctement configuré avec les redirections.
- **Images manquantes** : Assurez-vous que toutes les images sont dans le dossier `public` et que les chemins sont corrects.
- **Erreurs de build** : Consultez les logs de build sur Netlify pour identifier et résoudre les problèmes.

Pour plus d'aide, consultez la [documentation officielle de Netlify](https://docs.netlify.com/).
