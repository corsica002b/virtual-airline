SITE FINAL — COMPAGNIE VIRTUELLE
================================

Cette archive est la version finale FRONT-END prête à être publiée sur GitHub Pages.

IMPORTANT
---------
- Les pages, navigation, réservations, connexion démo, espace pilote, rapports,
  statistiques, classement, SimBrief de préparation et Live Map sont inclus.
- Les données de démonstration sont conservées dans le navigateur (localStorage).
- La Live Map utilise l'API publique VATSIM côté navigateur.
- La page SimBrief prépare les données mais ne remplace pas encore un backend/API
  SimBrief authentifié.
- Une authentification réellement sécurisée, une base de données serveur,
  Cloudflare Turnstile côté serveur et une validation serveur des vols nécessitent
  un backend. GitHub Pages ne fournit pas ce backend.

PUBLICATION GITHUB PAGES
------------------------
1. Décompresser l'archive.
2. Envoyer TOUT le contenu de ce dossier à la racine de la branche main.
3. Garder index.html à la racine.
4. Garder css/ et js/ à la racine.
5. Dans Settings > Pages : Deploy from a branch > main > / (root).
6. Attendre le déploiement.

Le fichier .nojekyll évite que GitHub tente de transformer les fichiers statiques
avec Jekyll.

COMPTE DEMO
-----------
Email : demo@virtualairlines.local
Mot de passe : demo123

FOND
----
Le thème sombre est forcé dans le CSS et un fond de secours est présent même si
l'image distante du hero n'est pas disponible.
