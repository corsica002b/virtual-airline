VIRTUAL AIRLINES — V3
======================

V3 évolue la V2 vers une interface de portail pilote plus immersive, inspirée des bonnes pratiques des VA modernes sans reproduire un site tiers.

NOUVEAUTÉS V3
- Nouveau tableau de bord : prochain vol, progression, statistiques, prochains vols, SimBrief et Live Map.
- Nouvel onglet « Live Map » dédié.
- Carte mondiale Leaflet avec données VATSIM publiques.
- Filtres : Tous / Ma VA / VATSIM / ATC.
- Avions de la VA distingués des autres pilotes VATSIM.
- Contrôleurs ATC affichés séparément avec fréquence.
- Recherche callsign / aéroport.
- Affichage des routes quand les coordonnées du plan de vol sont disponibles.
- Rafraîchissement VATSIM toutes les 15 secondes.
- Responsive PC / mobile.

IMPORTANT
Cette V3 reste une version de développement front-end. Les comptes utilisent localStorage et ne constituent pas une authentification sécurisée de production. La vraie base de données, les sessions serveur, Cloudflare Turnstile, l'intégration SimBrief serveur et l'identification robuste des vols VA devront être branchées côté backend.

STRUCTURE
- index.html : tableau de bord V3
- live-map.html : centre Live Map VATSIM
- autres pages : compagnie, flotte, destinations, programme, pilotes, statistiques, classement, actualités, espace pilote, SimBrief, rapports, connexion, inscription
- css/style.css : interface V3
- js/app.js : comptes, rapports, statistiques locales et fonctions communes
- js/live-map.js : carte VATSIM et filtres

OBJECTIF FUTUR
Réserver un vol → générer SimBrief → voler sur MSFS → voler sur VATSIM → détecter/récupérer le vol → rapport → validation → statistiques → classement.
