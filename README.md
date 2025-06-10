# MiniNetflix-JS

MiniNetflix-JS est une application web simple qui simule une plateforme de streaming vidéo. Ce projet est conçu pour apprendre et pratiquer le développement web avec Node.js.

## Table des matières

- [Prérequis](#prérequis)
- [Installation](#installation)
- [Lancement de l'application](#lancement-de-lapplication)
- [Accès à l'application](#accès-à-lapplication)
- [Structure du projet](#structure-du-projet)
- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)


## Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants sur votre machine :

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (Node Package Manager)

## Installation

Pour installer les dépendances nécessaires, exécutez la commande suivante dans le répertoire du projet :

```bash
npm install
```

## Lancement de l'application

Pour démarrer l'application en mode développement, utilisez la commande suivante :

```bash
npm run dev
```

Pour démarrer l'application en mode production, utilisez la commande suivante :

```bash
npm run start
```

## Accès à l'application

Une fois l'application démarrée, vous pouvez y accéder via votre navigateur web à l'adresse suivante :

[http://localhost:3000/](http://localhost:3000/)

## Structure du projet

Voici un aperçu de la structure du dossier du projet :

```
C:.
├───bin
├───data
├───node_modules
├───public
│   ├───images
│   ├───javascripts
│   └───stylesheets
├───routes
├───uploads
│   ├───images
│   └───videos
└───views
```

## Fonctionnalités

- Affichage de vidéos
- Interface utilisateur simple et intuitive
- Gestion des fichiers statiques (images, vidéos)

## Technologies utilisées

- [Node.js](https://nodejs.org/) : Environnement d'exécution JavaScript côté serveur.
- [Express](https://expressjs.com/) : Framework pour Node.js utilisé pour construire des applications web et API.
- [EJS](https://ejs.co/) : Moteur de template pour générer du HTML côté serveur.
- [Multer](https://www.npmjs.com/package/multer) : Middleware pour la gestion des uploads de fichiers.
- [Nodemon](https://nodemon.io/) : Utilitaire pour redémarrer automatiquement le serveur lors des modifications du code.

