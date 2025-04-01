
# International Genius Challenge (IGC) 2025 - Application Web

## À propos
Cette application web a été développée pour l'International Genius Challenge (IGC) 2025, une compétition éducative internationale axée sur la robotique pour des étudiants de niveau Secondaire (4e à Terminale) et Supérieur (BAC à BAC+5).

## Fonctionnalités

- **Accueil** : Page principale avec un titre, une description, et un bouton "S'inscrire".
- **Inscription** : Formulaire d'inscription pour les équipes, connecté à Supabase.
- **Guide** : Instructions pour les participants.
- **Admin (Dashboard)** : Tableau de suivi des équipes pour les administrateurs.
- **Connexion** : Page de connexion pour les admins (identifiants: "admin" / "igc2025").

## Technologies utilisées

- **React** avec TypeScript
- **React Router** pour la navigation
- **Supabase** pour la base de données
- **GSAP** pour les animations
- **Tailwind CSS** pour le style
- **shadcn/ui** pour les composants d'interface

## Installation

```bash
# Cloner le dépôt
git clone [URL_DU_REPO]

# Naviguer dans le dossier du projet
cd igc-2025

# Installer les dépendances
npm install

# Lancer l'application en développement
npm run dev
```

## Configuration

1. Créez un compte Supabase et un nouveau projet
2. Copiez les variables d'environnement dans un fichier `.env` à la racine du projet:
```
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_clé_anon_supabase
```

## Connexion Admin

Utilisez les identifiants suivants pour accéder à la section admin:
- Nom d'utilisateur: `admin`
- Mot de passe: `igc2025`

## Structure du projet

- `src/components` : Composants réutilisables
- `src/pages` : Pages principales de l'application
- `src/hooks` : Hooks personnalisés
- `src/lib` : Fonctions utilitaires
- `src/types` : Types TypeScript

## Déploiement

L'application peut être déployée sur n'importe quelle plateforme qui prend en charge les applications React (Vercel, Netlify, etc.).

```bash
# Construire l'application pour la production
npm run build
```

## Licence

© 2025 IGC – Tous droits réservés
