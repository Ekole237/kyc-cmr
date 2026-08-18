# Design mobile — KYC Cameroun

## Vision du MVP

KYC Cameroun est une application mobile destinée aux agents et responsables opérationnels qui suivent des dossiers de vérification d’identité. Le MVP facilite le parcours d’une personne à vérifier depuis la création de dossier jusqu’à la décision, tout en rendant visibles les pièces requises, les signaux de risque et l’éventuelle escalade vers une revue humaine.

### Décision de socle technique

La demande initiale mentionne Flutter. Le projet mobile géré dans cet environnement s’appuie toutefois sur **Expo / React Native**, qui produit une application native pour iOS et Android mais n’est pas un codebase Flutter/Dart. Le MVP est donc livré sur ce socle multiplateforme afin de pouvoir être prévisualisé, testé et construit ici. Une migration vers Flutter devra être traitée comme un projet de portage séparé, en conservant les flux, les modèles métier et les contrats d’intégration décrits dans ce document.

L’interface est conçue pour un téléphone utilisé en portrait (9:16), souvent d’une main et sur une connexion mobile variable. Elle privilégie donc des actions principales placées dans la moitié basse de l’écran, des états de progression explicites, des messages courts et une reprise de parcours simple après interruption.

## Utilisateurs et rôles de départ

| Rôle | Besoin principal | Parcours prioritaire |
|---|---|---|
| Agent KYC | Créer, compléter et suivre un dossier client | Tableau de bord → nouveau dossier → preuves → soumission |
| Responsable conformité | Identifier les dossiers à risque et justifier une décision | File de revue → détail du dossier → décision documentée |
| Client vérifié | Comprendre les étapes et transmettre les éléments demandés | Lien ou espace de vérification autonome dans une itération ultérieure |

Le premier MVP cible l’agent et le responsable conformité. Le parcours client autonome et les intégrations à un fournisseur KYC réel seront préparés par l’architecture, mais ne seront pas présentés comme une vérification réglementaire effective tant qu’un fournisseur, un cadre légal et des contrôles de sécurité ne seront pas validés.

## Liste des écrans

| Écran | Contenu et fonctionnalité |
|---|---|
| Accueil | Vue d’ensemble des dossiers, résumé des urgences, accès à l’action « Nouveau dossier » et aux dossiers récents. |
| Nouveau dossier | Formulaire court : nom complet, téléphone, type de document, ville et finalité de la vérification. |
| Parcours de vérification | Liste chronologique des étapes : données personnelles, document, selfie, preuves complémentaires, consentement et soumission. |
| Capture de document | Guide de capture de CNI ou passeport, critères de lisibilité et état de la pièce. Le MVP utilise une préparation de capture, sans analyse d’authenticité déclarée. |
| Vérification biométrique | Explication claire de la finalité, lancement de la capture et retour sur la qualité de l’image. Liveness et face matching restent à intégrer avec un fournisseur certifié. |
| Détail d’un dossier | Informations client, pièces, chronologie, signaux de risque, statut et actions de l’agent. |
| File de revue | Liste filtrable des dossiers nécessitant une attention humaine, triés par urgence et niveau de risque. |
| Décision et justification | Choix approbation, demande de complément ou escalade ; commentaire obligatoire pour les décisions sensibles. |
| Paramètres | Préférences de langue, règles de conservation visibles et statut de la connexion. |

## Flux utilisateur principaux

### Création et soumission d’un dossier

L’agent ouvre l’accueil, sélectionne « Nouveau dossier », renseigne les données minimales puis choisit le document présenté par la personne. L’application affiche les étapes restantes et enregistre localement la progression afin que le dossier puisse être repris après une interruption réseau. Lorsque les éléments requis sont présents, l’agent soumet le dossier pour évaluation.

### Décision adaptative

Après soumission, l’application visualise un score de risque explicable à titre de simulation du MVP. Un risque faible dirige le dossier vers une validation, un risque intermédiaire requiert un complément et un risque élevé l’envoie dans la file de revue. Chaque statut est accompagné d’une raison courte afin que l’agent sache quoi faire ensuite.

### Revue humaine

Le responsable conformité accède à la file de revue, ouvre un dossier, consulte les pièces et les signaux, puis choisit d’approuver, de demander un complément ou de rejeter. Une justification est enregistrée dans l’historique de la décision. Ce flux est indispensable : le MVP ne doit pas représenter l’automatisation comme une décision irrévocable.

## Modèle de données initial

| Entité | Champs essentiels | Utilité |
|---|---|---|
| DossierKYC | identifiant, nom, téléphone, document, ville, statut, niveau de risque, date de création | Représente une demande de vérification. |
| ÉtapeDeVérification | type, état, date, note | Suit les éléments attendus et leur avancement. |
| SignalDeRisque | catégorie, sévérité, explication, source | Rend le score interprétable et auditable. |
| Décision | décision, justification, auteur, horodatage | Conserve la décision humaine ou assistée. |

## Choix visuels

La direction visuelle est institutionnelle, claire et rassurante, sans reproduire les codes d’une banque existante. Le bleu profond traduit la confiance, le vert signale un parcours validé, l’ocre attire l’attention sur les compléments demandés et le rouge est réservé aux blocages ou aux risques élevés.

| Jeton | Couleur | Usage |
|---|---|---|
| Bleu confiance | `#0B2F5B` | Barre de navigation, titres, actions prioritaires. |
| Bleu clair | `#EAF2FF` | Fonds de cartes informatives et étapes en cours. |
| Vert validation | `#16794A` | État validé, succès et confirmation. |
| Ocre attention | `#B76E09` | Revue requise, élément manquant et avertissement. |
| Rouge risque | `#B42318` | Rejet, erreur et risque élevé. |
| Ivoire | `#F8FAFC` | Arrière-plan général, lisibilité et sobriété. |

Les composants suivent les conventions iOS : zones tactiles d’au moins 44 points, hiérarchie typographique nette, feuilles d’action pour les décisions contextuelles, contraste suffisant et messages d’erreur immédiatement actionnables. Les écrans ne doivent jamais reposer uniquement sur la couleur pour transmettre un statut.

## Principes de confiance et de confidentialité

Le MVP demande uniquement les informations nécessaires au parcours affiché. Avant toute étape biométrique, l’interface explique la raison de la demande, ce qui sera transmis et le fait que la fonctionnalité nécessitera un prestataire de vérification approuvé avant tout usage réel. Les documents affichés dans l’application doivent être masqués lorsqu’ils ne sont pas nécessaires à la tâche en cours.

## Contraintes du MVP

Le premier incrément est une démonstration fonctionnelle de parcours et de décision. Il ne constitue pas un service KYC certifié, ne vérifie pas une CNI camerounaise contre une base gouvernementale et ne doit pas être utilisé pour prendre des décisions financières, légales ou réglementaires réelles sans intégration fournisseur, analyse de conformité, sécurité serveur et validation métier.

Pour le passage à une vérification réelle, les appels à Smile ID, Dojah, Youverify ou à un autre fournisseur doivent être effectués côté serveur, avec des clés non exposées au client, des webhooks signés, un stockage chiffré des preuves, des règles de conservation validées et un mécanisme de recours humain. Le MVP prépare la séparation entre le parcours mobile, les signaux de risque et la décision humaine ; il ne déclenche pas d’appel de fournisseur et ne transmet aucune image à un tiers.
