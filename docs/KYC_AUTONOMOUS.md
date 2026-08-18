# KYC Cameroun — Fonctionnement autonome de la plateforme

## Positionnement

Cette version de KYC Cameroun est une plateforme de **collecte, d’instruction et de décision interne**. Elle ne dépend d’aucun fournisseur KYC et n’effectue aucune interrogation d’une base d’identité gouvernementale. Son objectif est de rendre le processus de vérification exploitable par une fintech locale : le client dépose un dossier, les équipes habilitées le contrôlent, et chaque action est enregistrée.

> Le statut « validé » signifie qu’un responsable autorisé a accepté le dossier selon la politique interne définie par l’institution. Il ne signifie pas que la CNI a été authentifiée auprès d’une autorité émettrice.

## Rôles et droits

| Rôle | Accès | Responsabilités |
|---|---|---|
| **Client** | Son propre espace KYC et ses propres dossiers | Créer un dossier, charger ses preuves, accepter le consentement et suivre son statut. |
| **Agent KYC** | File opérationnelle et dossiers soumis | Examiner la complétude, consulter les preuves et préparer une décision. |
| **Responsable conformité** | File opérationnelle, preuves et décisions | Prendre une décision justifiée, définir le niveau de risque retenu et demander un complément. |
| **Administrateur** | Tous les écrans opérationnels et gestion des rôles | Attribuer les rôles et superviser l’accès minimal nécessaire. |

Le serveur applique ces droits avant de renvoyer un dossier, une preuve ou une URL de téléchargement. Les preuves ne sont jamais listées globalement côté client ; elles sont liées à un dossier et vérifiées par le rôle de l’utilisateur qui les demande.

## Parcours client

| Étape | Action du client | Résultat dans le dossier |
|---|---|---|
| 1. Connexion | Le client accède à son espace authentifié. | Le dossier est associé à son compte. |
| 2. Informations | Il renseigne identité déclarée, téléphone, ville, document et finalité. | Un dossier commence au statut **Brouillon**. |
| 3. Preuves | Il prend une photo ou sélectionne un fichier pour la pièce et le selfie. | Les preuves sont déposées dans le stockage du projet avec empreinte SHA-256 et métadonnées. |
| 4. Consentement | Il accepte le traitement de son dossier. | L’horodatage du consentement est enregistré. |
| 5. Soumission | Il transmet le dossier lorsque les prérequis sont remplis. | Le dossier passe au statut **À analyser**. |
| 6. Suivi | Il consulte le statut final ou la demande de complément. | Le client peut comprendre la prochaine action attendue. |

La soumission est refusée si le consentement, la pièce d’identité ou le selfie sont absents. Une première classification de risque interne est appliquée à partir de règles simples et explicites : un titre de séjour ou une ville non déterminée conduit à une revue modérée ; ces règles ne sont pas un moteur de fraude ni une évaluation réglementaire.

## Parcours opérations et conformité

L’Agent KYC ou le Responsable conformité accède à la **File de revue**. Il peut ouvrir un dossier soumis, consulter ses preuves par un lien sécurisé, prendre connaissance de l’historique d’audit et enregistrer l’une des décisions suivantes.

| Décision | Statut enregistré | Attente côté client |
|---|---|---|
| Validation | `approved` | Le dossier est accepté selon la politique interne. |
| Demande de complément | `needs_info` | Le client doit fournir des éléments supplémentaires. |
| Clôture | `rejected` | Le dossier est refusé selon la justification enregistrée. |

Une justification d’au moins huit caractères et un niveau de risque sont obligatoires. La plateforme conserve ensuite l’auteur, l’horodatage, la décision et le motif dans le journal d’audit.

## Données et traçabilité

| Donnée | Stockage | Règle appliquée |
|---|---|---|
| Dossier KYC | Base de données projet | Identité déclarée, statut, risque, consentement et échéances de traitement. |
| Preuve | Stockage objet du projet | Référence de fichier, type MIME, taille, empreinte SHA-256 et propriétaire. |
| Décision | Base de données projet | Décision, justificatif, auteur et date. |
| Événement d’audit | Base de données projet | Création, consentement, dépôt de preuve, soumission et décision. |

L’application ne place pas de clé de stockage, de secret ou de document encodé dans l’interface. Les fichiers sont limités à 4 Mo par dépôt et aux formats JPEG, PNG ou PDF. Les politiques de conservation, de suppression et d’export doivent être définies par la fintech avant toute collecte de données réelles.

## Limites à communiquer lors d’une démonstration commerciale

La plateforme est crédible comme **workflow KYC interne sans dépendance externe**, mais elle n’est pas encore un système de vérification réglementaire autonome. Elle ne comprend ni contrôle d’authenticité de document, ni liveness biométrique, ni filtrage PEP/sanctions, ni surveillance transactionnelle. Ces fonctions nécessitent une politique conformité, des sources autorisées ou des fournisseurs spécifiques ; elles ne doivent pas être revendiquées sans mise en œuvre et validation appropriées.
