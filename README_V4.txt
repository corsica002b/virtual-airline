VIRTUAL AIRLINES — V4
=====================

V4 est une évolution de la V3. Elle ajoute une vraie logique de plateforme VA et prépare le passage au backend.

DEMO IMMEDIATE
--------------
E-mail : demo@virtualairlines.local
Mot de passe : demo123

Fonctions V4 visibles :
- tableau de bord pilote
- connexion / inscription
- réservations de vols
- annulation de réservation
- rapports de vol avec statut de validation
- statistiques pilote
- préparation SimBrief en mode démo
- Live Map VATSIM de la V3
- espace administration de démonstration
- responsive PC / téléphone
- stockage local pour le mode démo

BACKEND REEL PREPARE
--------------------
Le dossier supabase/schema.sql contient le schéma PostgreSQL conseillé pour Supabase.
js/config.js contient les paramètres à renseigner pour préparer une connexion Supabase.

IMPORTANT : la version fournie fonctionne sans serveur grâce au mode démo. Elle n'est pas encore une plateforme publique sécurisée tant que Supabase/Auth/RLS n'est pas configuré.

HEBERGEMENT GRATUIT POUR VOIR LE SITE
--------------------------------------
Option simple : GitHub Pages ou Cloudflare Pages.
1. Créer un dépôt GitHub.
2. Envoyer le contenu de ce dossier (le contenu de va_v1, pas le zip).
3. Activer GitHub Pages dans Settings > Pages > Deploy from branch.
4. Ouvrir l'URL fournie par GitHub.

Pour une vraie V4 en ligne :
- Frontend : Vercel / Cloudflare Pages / GitHub Pages
- Backend + base : Supabase
- Auth : Supabase Auth + RLS
- CAPTCHA : Cloudflare Turnstile
- API serveur : à ajouter pour SimBrief/VATSIM si nécessaire

NE PAS mettre une clé Supabase service_role dans le navigateur.
La clé anon/publishable peut être utilisée côté frontend avec des politiques RLS correctement configurées.
