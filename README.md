# Agbale - Système de gestion de bibliothèque

## Fonctionnalités principales

- **Tableau de bord dynamique avec indicateurs clés (KPIs)** : Suivi en temps réel des statistiques globales (nombre total d'ouvrages, membres actifs, livres en circulation, retours en retard) et flux d'activité récent.
- **Gestion du catalogue de livres** : Consultation, recherche multicritère et filtrage par catégorie ou par statut (*Disponible*, *Emprunté*, *Endommagé*, *Perdu*). Ajout, modification, duplication et suppression de fiches avec couvertures visuelles, codes ISBN et suivi des exemplaires.
- **Circulation des prêts et retours** : Enregistrement simplifié des emprunts avec autocomplétion intelligente, calcul automatique de la date d'échéance selon la politique de prêt, détection des dépassements et validation instantanée des retours.
- **Répertoire et gestion des membres** : Gestion complète des adhérents (profil, attribution des rôles : *Admin*, *Bibliothécaire*, *Membre*, coordonnées), suivi de l'historique et des quotas d'emprunt individuels.
- **Analyses et statistiques détaillées** : Tableaux de bord graphiques présentant les tendances d'emprunts au fil des mois, la répartition du catalogue par statut et les catégories les plus populaires.
- **Génération de rapports d'activité** : Création, prévisualisation et impression/exportation de rapports périodiques et de synthèses administratives complètes.
- **Paramètres et règles de la bibliothèque** : Configuration personnalisée des règles d'emprunt (durée maximale, quota de livres par membre), gestion du profil et bascule de thème clair/sombre.
- **Sécurité et authentification** : Interface de connexion pour protéger l'accès à l'application et restreindre les actions administratives.

## Stack 
- Next.js
- Tailwind CSS
- Prérequis : Node.js

> Le frontend du projet a été développé avec l'aide de Google Gemini.

## Installation

```bash
npm install
npm run dev          # http://localhost:3000
```

Autres scripts : `npm run build`, `npm run start`, `npm run typecheck`.

## Structure du projet

```
src/
├── app/
│   ├── layout.tsx              # Disposition racine, AppShell global
│   ├── page.tsx                # Redirection vers la page de connexion
│   ├── globals.css             # Tokens de design, styles globaux
│   ├── login/
│   ├── dashboard/              # Vue d'ensemble principale, flux d'activité
│   ├── catalog/                # Gestion du catalogue de livres avec emojis de catégories
│   ├── members/                # Répertoire des membres avec actions
│   ├── borrow/                 # Flux d'emprunts et de retours
│   ├── analytics/
│   └── settings/
├── components/
│   ├── layout/                 # AppShell, barre latérale, en-tête, etc.
│   ├── ui/                     # bouton, carte, badge, champ, etc.
│   └── views/                  # Un composant par route
├── hooks/                      # useTheme, verrouillage du défilement, état client, etc.
└── lib/
    ├── data.ts                 # Données simulées pour chaque vue
    ├── nav.ts                  # Configuration de la navigation
    └── cn.ts                   # classes Tailwind
```

## Contribution

1. Forkez le dépôt
2. Créez une branche pour vos modifications
3. Committez vos changements
4. Ouvrez une Pull Request

## Licence MIT
Développé pour les ONG à des fins éducatives ღ

### *_ARIGATO_*